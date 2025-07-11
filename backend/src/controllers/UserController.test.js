const UserController = require('./UserController');
const MysqlConnector = require('../repositories/helper/MysqlConnector');
const BcryptHelper = require('../services/helpers/BcryptHelper');

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

  test('Should find user by id', async () => {
    const controller = new UserController();

    const fakeRequest = {
      file: {
        location: 'https://path.com'
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

    const data = response?.data

    const userId = data?.id;

    const findUserRequest = {
      params: {
        id: userId,
      },
    };

    const foundUser = await controller.findById(findUserRequest);

    expect(response.status).toBe(200);
    expect(data.username).toBe(fakeRequest.body.username);
    expect(data.email).toBe(fakeRequest.body.email);
    expect(data.phone).toBe(fakeRequest.body.phone);
    expect(data.profile.birthday).toBe(fakeRequest.body.birthday);
    expect(data.profile.profile_picture).toBe(
      fakeRequest.file.location
    );
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
});
