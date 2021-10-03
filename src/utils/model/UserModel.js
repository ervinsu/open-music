const { nanoid } = require('nanoid');

class UserModel {
  constructor(entry, hashedPassword) {
    this.id = `user-${nanoid(10)}`;
    this.username = entry.username;
    this.password = hashedPassword;
    this.fullname = entry.fullname;
  }

  toInsertArray() {
    return [
      this.id,
      this.username,
      this.password,
      this.fullname,
    ];
  }
}

module.exports = UserModel;
