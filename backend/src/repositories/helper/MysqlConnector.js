const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

class MysqlConnector {
  static instance = null;
  connection = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new MysqlConnector();
      this.instance.connect();
    }

    return this.instance;
  }

  getConnection() {
    return this.connection;
  }

  connect() {
    if (!this.connection) {
      const connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: process.env.MYSQL_PASSWORD,
        database: process.env.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      this.connection = connection;
    }
  }
}

module.exports = MysqlConnector;
