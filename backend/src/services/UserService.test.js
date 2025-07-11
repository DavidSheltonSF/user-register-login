const UserService = require('./UserService');
const MysqlConnector = require('../repositories/helper/MysqlConnector');
const DuplicatedEmailError = require('./errors/DuplicatedEmailError');
const BcryptHelper = require('./helpers/BcryptHelper');
const NotOwnerError = require('./errors/NotOwnerError');
const NotFoundError = require('./errors/NotFoundError');

describe('Testing RegisterUserService', () => {
  async function makeConnectionSUT() {
    const mysqlConnector = MysqlConnector.getInstance();
    const connection = mysqlConnector.getConnection();

    if (!connection) {
      throw new Error('Connection is null');
    }

    return connection;
  }

  beforeEach(async () => {
    try {
      const connection = await makeConnectionSUT();
      await connection.execute('TRUNCATE TABLE users');
      await connection.execute('TRUNCATE TABLE profiles');
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    const connection = await makeConnectionSUT();
    connection.end();
  });

  test('Should find user by email', async () => {
    const service = new UserService();

    const fakeUser1 = {
      username: 'TesterFirst',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com',
    };

    const fakeUser2 = {
      username: 'UserFakeon',
      password: 'test123',
      email: 'junior@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com/feaf',
    };

    await service.create(fakeUser1);
    await service.create(fakeUser2);

    const foundUser1 = await service.findByEmail(fakeUser1.email);
    const foundUser2 = await service.findByEmail(fakeUser2.email);

    expect(foundUser1.username).toBe(fakeUser1.username);
    expect(foundUser2.username).toBe(fakeUser2.username);
  });

  test('Should find user by id', async () => {
    const service = new UserService();

    const fakeUser1 = {
      username: 'TesterFirst',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com',
    };

    const fakeUser2 = {
      username: 'UserFakeon',
      password: 'test123',
      email: 'junior@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com/feaf',
    };

    await service.create(fakeUser1);
    await service.create(fakeUser2);

    const foundUser1 = await service.findById(1, 1);
    const foundUser2 = await service.findById(2, 2);

    expect(foundUser2.username).toBe(fakeUser2.username);
    expect(foundUser1.username).toBe(fakeUser1.username);
  });

  test('Should throw NotFoundError when a user with the given email is not found', async () => {
    const service = new UserService();
    expect(service.findByEmail('notfound@bugmail.com')).rejects.toThrow(NotFoundError);
  });

  test('Should throw NotOwnerError when the authenticated user ID does not match the requested ID', async () => {
    const service = new UserService();

    const user = {
      username: 'TesterFirst',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com',
    };

    await service.create(user);

    expect(service.findById(5, 1)).rejects.toThrow(NotOwnerError);
  });

  test('Should throw NotFoundError when a user with the given ID is not found', async () => {
    const service = new UserService();
    expect(service.findById(1, 1)).rejects.toThrow(NotFoundError);
  });

  test('Should create a new user in the database', async () => {
    const connection = await makeConnectionSUT();
    const service = new UserService();

    const user = {
      username: 'TesterFirst',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com',
    };

    const registredUser = await service.create(user);

    const result = await connection.query('SELECT * FROM users WHERE id=?', [
      registredUser.id,
    ]);

    const [foundUser] = result[0];

    expect(registredUser.id).toBeTruthy();
    expect(foundUser.username).toBe(user.username);
    expect(
      BcryptHelper.compare(user.password, registredUser.password)
    ).toBeTruthy();
    expect(registredUser.email).toBe(user.email);
    expect(registredUser.phone).toBe(user.phone);
    expect(registredUser.profile.birthday.getTime()).toBe(
      new Date(user.birthday).getTime()
    );
    expect(registredUser.profile.profile_picture).toBe(user.profile_picture);

    expect(foundUser.username).toBe(user.username);
    expect(
      BcryptHelper.compare(user.password, foundUser.password)
    ).toBeTruthy();
    expect(foundUser.email).toBe(user.email);
    expect(foundUser.phone).toBe(user.phone);
  });

  test('Should  not register a user with duplicated email in the database', async () => {
    const service = new UserService();

    const fakeUser = {
      username: 'TesterFirst',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com',
    };

    const userWithDuplicatedEmail = {
      username: 'UserFakeon',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
      birthday: '1988-05-21',
      profile_picture: 'https://path.com/feaf',
    };

    await service.create(fakeUser);
    await expect(service.create(userWithDuplicatedEmail)).rejects.toThrow(
      DuplicatedEmailError
    );
  });
});
