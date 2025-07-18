const UserRepository = require('./UserRepository');
const MysqlConnector = require('./helper/MysqlConnector');
const objectsToValuesArrays = require('./helper/objectsToValuesArrays');

describe('Testing UserRepository', () => {
  const mysqlConnector = MysqlConnector.getInstance();

  const connection = mysqlConnector.getConnection();

  beforeEach(async () => {
    try {
      await connection.execute('TRUNCATE TABLE users');
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    connection.end();
  });

  test('Should find all users in the database', async () => {
    const userRepository = new UserRepository();

    const users = [
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

    const mappedusers = objectsToValuesArrays(users);

    // create user users
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedusers]
    );

    const result = await userRepository.findAll();

    expect(result[0].username).toBe(users[0].username);
    expect(result[0].password).toBe(users[0].password);
    expect(result[0].email).toBe(users[0].email);
    expect(result[0].phone).toBe(users[0].phone);

    expect(result[1].username).toBe(users[1].username);
    expect(result[1].password).toBe(users[1].password);
    expect(result[1].email).toBe(users[1].email);
    expect(result[1].phone).toBe(users[1].phone);
  });

  test('Should find a user by id', async () => {
    const userRepository = new UserRepository();

    const users = [
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

    const mappedusers = objectsToValuesArrays(users);

    // create user users
    const [results] = await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedusers]
    );

    const userId1 = results.insertId;
    const userId2 = results.insertId + 1;

    const founduser1 = await userRepository.findById(userId1);
    const founduser2 = await userRepository.findById(userId2);

    expect(founduser1.username).toBe(users[0].username);
    expect(founduser1.password).toBe(users[0].password);
    expect(founduser1.email).toBe(users[0].email);
    expect(founduser1.phone).toBe(users[0].phone);

    expect(founduser2.username).toBe(users[1].username);
    expect(founduser2.password).toBe(users[1].password);
    expect(founduser2.email).toBe(users[1].email);
    expect(founduser2.phone).toBe(users[1].phone);
  });

  test('Should find a user by email', async () => {
    const userRepository = new UserRepository();

    const users = [
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

    const mappedusers = objectsToValuesArrays(users);

    // create user users
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedusers]
    );

    const founduser1 = await userRepository.findByEmail(users[0].email);
    const founduser2 = await userRepository.findByEmail(users[1].email);

    expect(founduser1.username).toBe(users[0].username);
    expect(founduser1.password).toBe(users[0].password);
    expect(founduser1.email).toBe(users[0].email);
    expect(founduser1.phone).toBe(users[0].phone);

    expect(founduser2.username).toBe(users[1].username);
    expect(founduser2.password).toBe(users[1].password);
    expect(founduser2.email).toBe(users[1].email);
    expect(founduser2.phone).toBe(users[1].phone);
  });

  test('Should create a new user in the database', async () => {
    const userRepository = new UserRepository();

    const user = {
      username: 'Jeronimo',
      password: 'jero123',
      email: 'jeronimo@bugmail.com',
      phone: '21585478565',
    };

    const createduser = await userRepository.create(user);

    const result = await connection.query('SELECT * FROM users WHERE id=?', [
      createduser.id,
    ]);

    const [founduser] = result[0];

    expect(createduser.id).toBeTruthy();
    expect(founduser.username).toBe(user.username);
    expect(founduser.password).toBe(user.password);
    expect(founduser.email).toBe(user.email);
    expect(founduser.phone).toBe(user.phone);
  });
});
