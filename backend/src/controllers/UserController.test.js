const UserController = require('./UserController');
const MysqlConnector = require('../repositories/helper/MysqlConnector');
const BcryptHelper = require('../services/helpers/BcryptHelper');
const { badRequest, unprocessableEntity } = require('./http/http-helpers');
const MissingFieldsError = require('./errors/MissingFieldsError');
const DuplicatedEmailError = require('../services/errors/DuplicatedEmailError');

describe('Testing UserController', () => {
  const mysqlHelper = MysqlConnector.getInstance();
  const connection = mysqlHelper.getConnection();
  const controller = new UserController();

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

  test('Should throw MissingFieldsError if username is not provided in the body request', async () => {
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

    await expect(controller.create(fakeRequest)).rejects.toThrow(
      MissingFieldsError
    );
  });

  test('Should return MissingFieldsError if password is not provided in the body request', async () => {
    const fakeRequest = {
      file: {
        location: 'https://path.com',
      },
      body: {
        username: 'fakeName',
        email: 'test@bugmail.com',
        phone: '215858484',
        birthday: '1988-05-21',
      },
    };

    await expect(controller.create(fakeRequest)).rejects.toThrow(
      MissingFieldsError
    );
  });

  test('Should throw DuplicatedEmailError if the email provided is already associated with a user', async () => {
    const fakeRequest = {
      file: {
        location: 'https://path.com',
      },
      body: {
        username: 'fakeName',
        password: 'Dafdsnfiasf',
        email: 'test@bugmail.com',
        phone: '215858484',
        birthday: '1988-05-21',
      },
    };

    await controller.create(fakeRequest);

    await expect(controller.create(fakeRequest)).rejects.toThrow(
      DuplicatedEmailError
    );
  });

  test('Should login a user properly', async () => {
    const user = {
      email: 'jeroldo@bugmail.com',
      password: 'dsnfajkdfnaf',
    };

    const createRequest = {
      file: {
        location: 'https://path.com',
      },
      body: {
        username: 'fakeName',
        password: user.password,
        email: user.email,
        phone: '215858484',
        birthday: '1988-05-21',
      },
    };

    const loginRequest = {
      body: {
        email: user.email,
        password: user.password,
      },
    };

    await controller.create(createRequest);

    const response = await controller.login(loginRequest);

    const body = createRequest.body;
    const userData = response.data.user;

    expect(response.status).toBe(200);
    expect(response.data.token).toBeTruthy();
    expect(userData.username).toBe(body.username);
    expect(userData.email).toBe(body.email);
    expect(userData.phone).toBe(body.phone);
  });
});
