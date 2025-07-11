const MysqlConnector = require('./helper/MysqlConnector');

class UserRepository {
  connection = MysqlConnector.getInstance().getConnection();

  async findAllUsers() {
    const result = await this.connection.query('SELECT * FROM users');
    return result[0];
  }

  async findUserById(id) {
    const [result] = await this.connection.query('SELECT * FROM users WHERE id=?', [
      id,
    ]);
    return result[0];
  }

  async findUserByEmail(email) {
    const [result] = await this.connection.query(
      'SELECT * FROM users WHERE email=?',
      [email]
    );
    return result[0];
  }

  async create(userData) {
    const { username, password, email, phone } = userData;

    const [result] = await this.connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)
    `,
      [username, password, email, phone]
    );

    const userId = await result.insertId;

    const [response] = await this.connection.query('SELECT * FROM users WHERE id=?', [
      userId,
    ]);

    if (response.length === 0) {
      return null;
    }

    const [foundUser] = response;

    return {
      id: userId,
      ...foundUser,
    };
  }
}

module.exports = UserRepository;
