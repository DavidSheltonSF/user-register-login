const UserRepository = require('./UserRepository');
const MysqlHelper = require('./helper/MysqlHelper');

describe('Testing UserRepository', () => {
  async function makeConnectionSUT() {
    const mysqlHelper = await MysqlHelper.create();
    const connection = mysqlHelper.getConnection();

    return connection;
  }

  beforeAll(async () => {
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
      username: 'Tester',
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
});
