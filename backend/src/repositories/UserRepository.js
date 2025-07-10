const MysqlConnector = require('./helper/MysqlConnector');

class UserRepository {
  databaseConnector = MysqlConnector.getInstance();

  async findAllUsers() {
    const connection = this.databaseConnector.getConnection();

    const result = await connection.query('SELECT * FROM users');

    return result[0];
  }

  async findUserById(id) {
    const connection = this.databaseConnector.getConnection();

    const [result] = await connection.query('SELECT * FROM users WHERE id=?', [
      id,
    ]);

    return result[0];
  }

  async findUserByEmail(email) {
    const connection = this.databaseConnector.getConnection();

    const [result] = await connection.query(
      'SELECT * FROM users WHERE email=?',
      [email]
    );

    return result[0];
  }

  async add(userData) {
    const connection = this.databaseConnector.getConnection();

    const { username, password, email, phone } = userData;

    let userId = undefined;
    const [result] = await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)
    `,
      [username, password, email, phone]
    );

    userId = await result.insertId;

    const response = await connection.query('SELECT * FROM users WHERE id=?', [
      userId,
    ]);

    if (response[0].length === 0) {
      return null;
    }

    const [foundUser] = response[0];

    return {
      id: userId,
      ...foundUser,
    };
  }
}

module.exports = UserRepository;
