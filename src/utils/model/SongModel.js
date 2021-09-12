const { nanoid } = require('nanoid');

class SongModel {
    constructor(payload, id = 0) {
        if (id == 0) {
            this.id = `song-${nanoid(15)}`;
        } else {
            this.id = id;
        }

        this.title = payload.title;
        this.year = payload.year;
        this.performer = payload.performer;
        this.genre = payload.genre;
        this.duration = payload.duration;

        const currentTime = new Date().toISOString();
        this.insertedAt = currentTime;
        this.updatedAt = currentTime;
    }

    toInsertArray() {
        return [
            this.id,
            this.title,
            this.year,
            this.performer,
            this.genre,
            this.duration,
            this.insertedAt,
            this.updatedAt,
        ];
    }

    static toUpdateArray(newUpdateSong) {
        return [
            newUpdateSong.title,
            newUpdateSong.year,
            newUpdateSong.performer,
            newUpdateSong.genre,
            newUpdateSong.duration,
            newUpdateSong.updatedAt,
            newUpdateSong.id,
        ];
    }

    static mapDbToModel(dbObject) {
        const model = { ...dbObject, insertedAt: dbObject.inserted_at, updatedAt: dbObject.updated_at };
        delete model.inserted_at;
        delete model.updated_at;
        return model;
    }
}

module.exports = SongModel;
