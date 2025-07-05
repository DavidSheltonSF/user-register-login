const MysqlHelper = require('./helper/MysqlHelper');


class UserRepository {

  databaseHandler = MysqlHelper.create();

  async findAllUsers() {
    const connection = this.databaseHandler.getConnection();

    const result = await connection.query('SELECT * FROM users');

    return result[0];
  }

  async findUserById(id){

  }

  async add(userData) {
   const connection = this.databaseHandler.getConnection();;

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
