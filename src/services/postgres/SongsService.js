const { Pool } = require('pg');
const SongModel = require('../../utils/model');
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDbToModel, updateModel, toUpdateArray } = require('../../utils/model');


class SongsService {
    constructor() {
        this._pool = new Pool()
    }

    async addNote(payload) {
        const songModel = new SongModel(payload);

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            values: songModel.toInsertArray(),
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }


    async getSongs() {
        const result = await this._pool.query('SELECT id, title, performer FROM songs');
        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu yang Anda cari tidak ditemukan');
        }

        return result.rows.map(mapDbToModel)[0];
    }

    async editSongById(id, payload) {
        const newSongData = new SongModel(payload, id);
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: toUpdateArray(newSongData),
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
    }

    async truncateTable() {
        try {
            await this._pool.query('TRUNCATE TABLE songs');
        } catch (error) {
            throw new Error('Terdapat kesalahan pada sistem');
        }
    }
}
module.exports = SongsService;
