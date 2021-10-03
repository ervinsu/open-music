const { nanoid } = require('nanoid');

class PlaylistSongModel {
  constructor(entry) {
    this.id = `playlist_song-${nanoid(10)}`;
    this.playlistId = entry.playlistId;
    this.songId = entry.songId;
  }

  toInsertArray() {
    return [
      this.id,
      this.playlistId,
      this.songId,
    ];
  }
}

module.exports = PlaylistSongModel;
