const MysqlHelper = require('./helper/MysqlHelper');

class UserRepository{
async add(){
    const mysqlHelper = await MysqlHelper.create();
    const connection = mysqlHelper.getConnection();

    connection.query(`
      INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)
    `, ['david', 'david123', 'teste', '212944'], (err, results) => {
      if(err){
        console.log(err)
      } else {
        console.log(results.insertId);
      }
    });

  }
}

module.exports = UserRepository;