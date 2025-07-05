const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

class MysqlHelper {
  static instance = null;
  connection = null;

constructor(connection){
  this.connection = connection
}

static async create(){
  if(!this.instance){
    const connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })


    
    this.instance = new MysqlHelper(connection);
  }

    return this.instance
  }

  getConnection(){
    return this.connection;
  }
  
}

module.exports = MysqlHelper;