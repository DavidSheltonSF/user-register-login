const MysqlHelper = require('./helper/MysqlHelper');

class UserRepository {
  async add(userData) {
    const mysqlHelper = await MysqlHelper.create();
    const connection = mysqlHelper.getConnection();

    const { username, password, email, phone } = userData;

    //const query = util.promisify(connection.query).bind(connection);

    let userId = undefined;
    const [result] = await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)
    `,
      [username, password, email, phone]
    );

    console.log(result);
    return (userId = await result.insertId);
  }
}

module.exports = UserRepository;
