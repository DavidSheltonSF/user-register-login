const UserService = require('./UserService');
const MysqlConnector = require('../repositories/helper/MysqlConnector');
const DuplicatedEmailError = require('./errors/DuplicatedEmailError');
const BcryptHelper = require('./helpers/BcryptHelper');
const NotOwnerError = require('./errors/NotOwnerError');
const NotFoundError = require('./errors/NotFoundError');
const InvalidPasswordError = require('./errors/InvalidPasswordError');

describe('Testing CreateUserService', () => {
  const mysqlConnector = MysqlConnector.getInstance();
  const connection = mysqlConnector.getConnection();

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

    expect(foundUser1.username).toBe(fakeUser1.username);
    expect(foundUser1.email).toBe(fakeUser1.email);
    expect(foundUser1.phone).toBe(fakeUser1.phone);
    expect(foundUser1.profile.birthday.getTime()).toBe(
      new Date(fakeUser1.birthday).getTime()
    );
    expect(foundUser1.profile.profile_picture).toBe(fakeUser1.profile_picture);
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

    expect(foundUser1.username).toBe(fakeUser1.username);
    expect(foundUser1.email).toBe(fakeUser1.email);
    expect(foundUser1.phone).toBe(fakeUser1.phone);
    expect(foundUser1.profile.birthday).toBe(fakeUser1.birthday);
    expect(foundUser1.profile.profile_picture).toBe(fakeUser1.profile_picture);
  });

  test('Should throw NotFoundError when a user with the given email is not found', async () => {
    const service = new UserService();
    expect(service.findByEmail('notfound@bugmail.com')).rejects.toThrow(
      NotFoundError
    );
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
    expect(registredUser.email).toBe(user.email);
    expect(registredUser.phone).toBe(user.phone);
    expect(registredUser.profile.birthday).toBe(user.birthday);
    expect(registredUser.profile.profile_picture).toBe(user.profile_picture);

    expect(foundUser.username).toBe(user.username);
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

  test('Should login user properly', async () => {
    const service = new UserService();

    const user = {
      username: 'Jeraldo',
      password: 'jj123',
      email: 'jeraldo@email.com',
      phone: '215585871',
      birthday: '1980-05-12',
      profile_picture: 'https://path/jera',
    };

    await service.create(user);

    const authData = await service.login(user.email, user.password);

    const authUser = authData.user;
    const token = authData.token;

    expect(authUser.username).toBe(user.username);
    expect(authUser.email).toBe(user.email);
    expect(authUser.phone).toBe(user.phone);
    expect(token).toBeTruthy();
  });

  test('Should throw NotFoundError when trying to login a user with not found email', async () => {
    const service = new UserService();
    await expect(service.login('notfound@email.com', 'dfadf')).rejects.toThrow(
      NotFoundError
    );
  });

  test('Should throw InvalidPasswordError when trying to login a user with incorrect password', async () => {
    const service = new UserService();

    const user = {
      username: 'Jeraldo',
      password: 'jj123',
      email: 'jeraldo@email.com',
      phone: '215585871',
      birthday: '1980-05-12',
      profile_picture: 'https://path/jera',
    };

    await service.create(user);

    await expect(
      service.login(user.email, 'incorrectPassword')
    ).rejects.toThrow(InvalidPasswordError);
  });
});
