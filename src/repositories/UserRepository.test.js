const UserRepository = require('./UserRepository');
const MysqlHelper = require('./helper/MysqlHelper');
const MysqlMapper = require('./helper/MysqlMapper');

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
      username: 'Jeronimo',
      password: 'jero123',
      email: 'jeronimo@bugmail.com',
      phone: '21585478565',
    };

    const createduser = await userRepository.add(fakeUser);

    const result = await connection.query('SELECT * FROM users WHERE id=?', [
      createduser.id,
    ]);

    const [founduser] = result[0];

    expect(createduser.id).toBeTruthy();
    expect(founduser.username).toBe(fakeUser.username);
    expect(founduser.password).toBe(fakeUser.password);
    expect(founduser.email).toBe(fakeUser.email);
    expect(founduser.phone).toBe(fakeUser.phone);
  });

  test('Should find all users in the database', async () => {
    const connection = await makeConnectionSUT();
    const userRepository = new UserRepository();

    const fakeUsers = [
      {
        username: 'Jeronimo',
        password: 'jero123',
        email: 'jeronimo@bugmail.com',
        phone: '21585478565',
      },
      {
        username: 'Maria',
        password: 'mari123',
        email: 'maria@bugmail.com',
        phone: '21585477565',
      },
    ];

    const mappedfakeUsers = MysqlMapper.mapUsers(fakeUsers);

    // Add user users
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedfakeUsers]
    );

    const result = await userRepository.findAllUsers();

    expect(result[0].username).toBe(fakeUsers[0].username);
    expect(result[0].password).toBe(fakeUsers[0].password);
    expect(result[0].email).toBe(fakeUsers[0].email);
    expect(result[0].phone).toBe(fakeUsers[0].phone);

    expect(result[1].username).toBe(fakeUsers[1].username);
    expect(result[1].password).toBe(fakeUsers[1].password);
    expect(result[1].email).toBe(fakeUsers[1].email);
    expect(result[1].phone).toBe(fakeUsers[1].phone);
  });

  test('Should find a user by id', async () => {
    const connection = await makeConnectionSUT();
    const userRepository = new UserRepository();

    const fakeUsers = [
      {
        username: 'Jeronimo',
        password: 'jero123',
        email: 'jeronimo@bugmail.com',
        phone: '21585478565',
      },
      {
        username: 'Maria',
        password: 'mari123',
        email: 'maria@bugmail.com',
        phone: '21585477565',
      },
    ];

    const mappedfakeUsers = MysqlMapper.mapUsers(fakeUsers);

    // Add user users
    const [results] = await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedfakeUsers]
    );

    const userId1 = results.insertId;
    const userId2 = results.insertId + 1;

    const founduser1 = await userRepository.findUserById(userId1);
    const founduser2 = await userRepository.findUserById(userId2);

    expect(founduser1.username).toBe(fakeUsers[0].username);
    expect(founduser1.password).toBe(fakeUsers[0].password);
    expect(founduser1.email).toBe(fakeUsers[0].email);
    expect(founduser1.phone).toBe(fakeUsers[0].phone);

    expect(founduser2.username).toBe(fakeUsers[1].username);
    expect(founduser2.password).toBe(fakeUsers[1].password);
    expect(founduser2.email).toBe(fakeUsers[1].email);
    expect(founduser2.phone).toBe(fakeUsers[1].phone);
  });

  test('Should find a user by id', async () => {
    const connection = await makeConnectionSUT();
    const userRepository = new UserRepository();

    const fakeUsers = [
      {
        username: 'Jeronimo',
        password: 'jero123',
        email: 'jeronimo@bugmail.com',
        phone: '21585478565',
      },
      {
        username: 'Maria',
        password: 'mari123',
        email: 'maria@bugmail.com',
        phone: '21585477565',
      },
    ];

    const mappedfakeUsers = MysqlMapper.mapUsers(fakeUsers);

    // Add user users
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedfakeUsers]
    );

    const founduser1 = await userRepository.findUserByEmail(fakeUsers[0].email);
    const founduser2 = await userRepository.findUserByEmail(fakeUsers[1].email);

    expect(founduser1.username).toBe(fakeUsers[0].username);
    expect(founduser1.password).toBe(fakeUsers[0].password);
    expect(founduser1.email).toBe(fakeUsers[0].email);
    expect(founduser1.phone).toBe(fakeUsers[0].phone);

    expect(founduser2.username).toBe(fakeUsers[1].username);
    expect(founduser2.password).toBe(fakeUsers[1].password);
    expect(founduser2.email).toBe(fakeUsers[1].email);
    expect(founduser2.phone).toBe(fakeUsers[1].phone);
  });
});
