const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const PlaylistModel = require('../../utils/model/PlaylistModel');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist(payload) {
        const newPlaylist = new PlaylistModel(payload);
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: newPlaylist.toInsertArray(),
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylistsByUserId({ userId }) {
        const query = {
            text: `SELECT playlists.id, playlists.name, users.username
                 FROM playlists
                 INNER JOIN users ON playlists.owner = users.id  
                 WHERE playlists.owner = $1`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        // INNER JOIN users ON playlists.owner = users.id  
        // LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        // OR collaborations.user_id = $1

        return result.rows;
    }

    async deletePlaylistByPlaylistId({ playlistId, userId }) {
        await this.verifyPlaylistOwnerAccess(playlistId, userId);
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }

    async verifyPlaylistOwnerAccess(playlistId, userId) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (result.rows[0].owner !== userId) {
            throw new AuthorizationError('Gagal melakukan operasi. Anda bukan pemilik playlist ini');
        }
    }

    async verifyPlaylistIsExist(playlistId) {
        const query = {
            text: 'SELECT COUNT(1) FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result) {
            throw new NotFoundError('Playlist yang dicari tidak ditemukan');
        }
    }

}

module.exports = PlaylistsService;
