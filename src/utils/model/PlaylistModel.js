const { nanoid } = require('nanoid');

class PlaylistModel {
  constructor(entry) {
    this.id = `playlist-${nanoid(10)}`;
    this.name = entry.name;
    this.owner = entry.owner;
  }

  getOwner() {
    return this.owner;
  }

  toInsertArray() {
    return [
      this.id,
      this.name,
      this.owner,
    ];
  }
}

module.exports = PlaylistModel;
