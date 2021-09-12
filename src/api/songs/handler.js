const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postSongHandler(request, h) {
        this._validator.validatePostSongPayload(request.payload);

        const newSongId = await this._service.addSong(request.payload);

        return successResponse(h, {
            responseMessage: 'Lagu berhasil ditambahkan',
            responseData: { songId: newSongId },
            responseCode: 201,
        });
    }

    async getAllSongsHandler(_, h) {

        const songs = await this._service.getSongs();

        return successResponse(h, {
            responseData: { songs: songs },
        });
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;

        const song = await this._service.getSongById(id);

        return successResponse(h, {
            responseData: { song: song },
        });
    }

    async putSongByIdHandler(request, h) {
        this._validator.validatePutSongPayload(request.payload);
        const { id } = request.params;

        await this._service.editSongById(id, request.payload);

        return successResponse(h, {
            responseMessage: 'lagu berhasil diperbarui'
        });
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;

        await this._service.deleteSongById(id);

        return successResponse(h, {
            responseMessage: 'lagu berhasil dihapus'
        });
    }

    async truncateSong(_, h) {
        await this._service.truncateTable();
        return successResponse(h, {
            responseMessage: 'Tabel song berhasil di truncate',
        });
    }

}

module.exports = SongsHandler;
