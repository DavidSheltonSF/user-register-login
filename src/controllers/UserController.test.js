const UserController = require('./UserController');
const MysqlHelper = require('../repositories/helper/MysqlHelper');

describe('Testing UserController', () => {
  async function makeConnectionSUT() {
    const mysqlHelper = MysqlHelper.create();
    mysqlHelper.connect();
    const connection = mysqlHelper.getConnection();

    if (!connection) {
      throw new Error('Connection is null');
    }

    return connection;
  }

  beforeEach(async () => {
    try {
      const connection = await makeConnectionSUT();
      await connection.execute('TRUNCATE TABLE users');
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    const connection = await makeConnectionSUT();
    connection.end();
  });

  test('Should create a new user in the database', async () => {
    const connection = await makeConnectionSUT();
    const controller = new UserController();

    const fakeRequest = {
      body: {
        username: 'TesterFirst',
        password: 'test123',
        email: 'test@bugmail.com',
        phone: '215858484',
        birthday: '1988-05-21',
        profile_picture: 'https://path.com',
      },
    };


    const response = await controller.create(fakeRequest);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(fakeRequest.body.username);
  });

});
