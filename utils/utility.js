const bcrypt = require("bcrypt");

class Utility {
  static instance;

  static getInstance() {
    if (!Utility.instance) {
      Utility.instance = new Utility();
    }
    return Utility.instance;
  }

  generateRandomID(prefix) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${randomNumber}`;
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = Utility.getInstance();
