const bcrypt = require('bcrypt');

class BcryptHelper {
  static async hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  }

  static async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = BcryptHelper;
