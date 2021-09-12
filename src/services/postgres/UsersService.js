const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const UserModel = require('../../utils/model/UserModel');
const InvariantError = require('../../exceptions/InvariantError');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

class UsersService {
    constructor() {
        this._pool = new Pool()
    }

    async addUser(payload) {
        await this.verifyNewUsername(payload);
        const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
        const userModel = new UserModel(payload, hashedPassword);

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: userModel.toInsertArray(),
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async verifyNewUsername({ username }) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rowCount > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }

    // async verifyUserCredential({ username, password }) {
    //     const query = {
    //         text: 'SELECT id, password FROM users WHERE username = $1',
    //         values: [username],
    //     };

    //     const result = await this._pool.query(query);

    // if (!result.rowCount) {
    //     throw new AuthenticationError('Kredensial yang Anda berikan salah');
    // }

    // const { id, password: hashedPassword } = result.rows[0];

    // const match = await bcrypt.compare(password, hashedPassword);

    // if (!match) {
    //     throw new AuthenticationError('Kredensial yang Anda berikan salah');
    // }

    //     return "id";
    // }
}

module.exports = UsersService;