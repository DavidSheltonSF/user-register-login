const UserController = require('./UserController');
const MysqlConnector = require('../repositories/helper/MysqlConnector');
const BcryptHelper = require('../services/helpers/BcryptHelper');
const { badRequest } = require('./http/http-helpers');

describe('Testing UserController', () => {
  const mysqlHelper = MysqlConnector.getInstance();
  const connection = mysqlHelper.getConnection();

  beforeEach(async () => {
    try {
      await connection.execute('TRUNCATE TABLE users');
      await connection.execute('TRUNCATE TABLE profiles');
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    connection.end();
  });

  test('Should create a new user in the database', async () => {
    const controller = new UserController();

    const fakeRequest = {
      file: {
        location: 'https://path.com',
      },
      body: {
        username: 'TesterFirst',
        password: 'test123',
        email: 'test@bugmail.com',
        phone: '215858484',
        birthday: '1988-05-21',
      },
    };

    const response = await controller.create(fakeRequest);

    const data = response?.data;

    const bodyRequest = fakeRequest.body;

    expect(response.status).toBe(200);
    expect(data).toBeTruthy();
    expect(bodyRequest.username).toBe(data.username);
    expect(bodyRequest.email).toBe(data.email);
    expect(bodyRequest.phone).toBe(data.phone);
    expect(fakeRequest.file.location).toBe(data.profile.profile_picture);
  });

  test('Should return BadRequest(400) if username is not provided in the body request', async () => {
    const controller = new UserController();

    const fakeRequest = {
      file: {
        location: 'https://path.com',
      },
      body: {
        password: 'test123',
        email: 'test@bugmail.com',
        phone: '215858484',
        birthday: '1988-05-21',
      },
    };

    const response = await controller.create(fakeRequest);

    expect(response.status).toBe(badRequest().status);
  });
});
