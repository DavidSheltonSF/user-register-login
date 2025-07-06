const UserRepository = require('./UserRepository');
const MysqlHelper = require('./helper/MysqlHelper');

describe('Testing UserRepository', () => {
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

  test('Should add a new user in the database', async () => {
    const connection = await makeConnectionSUT();
    const userRepository = new UserRepository();

    const fakeUser = {
      username: 'TesterFirst',
      password: 'test123',
      email: 'test@bugmail.com',
      phone: '215858484',
    };

    const createdUser = await userRepository.add(fakeUser);

    const result = await connection.query('SELECT * FROM users WHERE id=?', [
      createdUser.id,
    ]);

    const [foundUser] = result[0];

    expect(createdUser.id).toBeTruthy();
    expect(foundUser.username).toBe(fakeUser.username);
    expect(foundUser.password).toBe(fakeUser.password);
    expect(foundUser.email).toBe(fakeUser.email);
    expect(foundUser.phone).toBe(fakeUser.phone);
  });

  test('Should find all users in the database', async () => {
    const connection = await makeConnectionSUT();
    const userRepository = new UserRepository();

    const fakeUsers = [
      ['TesterJARIA', 'test123', 'test@bugmail', '2325232'],
      ['TesterSUPREM', 'test123', 'test111@bugmail', '2325855241'],
    ];

    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [fakeUsers]
    );

    const result = await userRepository.findAllUsers();

    expect(result.length).toBe(fakeUsers.length);
  });

  test('Should find a user by id', async () => {
    const connection = await makeConnectionSUT();
    const userRepository = new UserRepository();

    const fakeUsers = [
      ['TesterJARIA', 'test123', 'test@bugmail', '2325232'],
      ['TesterSUPREM', 'test123', 'test111@bugmail', '2325855241'],
    ];

    const [results] = await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [fakeUsers]
    );

    const firstUserId = results.insertId;
    const secondUserId = results.insertId + 1;

    const foundFirstUser = await userRepository.findUserById(firstUserId);
    const foundSecondUser = await userRepository.findUserById(secondUserId);

    expect(foundFirstUser.username).toBe(fakeUsers[0][0]);
    expect(foundFirstUser.password).toBe(fakeUsers[0][1]);

    expect(foundSecondUser.username).toBe(fakeUsers[1][0]);
    expect(foundSecondUser.password).toBe(fakeUsers[1][1]);
  });
});
