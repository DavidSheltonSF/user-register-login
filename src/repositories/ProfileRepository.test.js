const ProfileRepository = require('./ProfileRepository');
const MysqlHelper = require('./helper/MysqlHelper');

describe('Testing profileRepository', () => {
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
      await connection.execute('TRUNCATE TABLE profiles');
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    const connection = await makeConnectionSUT();
    connection.end();
  });

  test('Should add a new profile in the database', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeprofile = {
      user_id: 1,
      birthday: new Date('2002-02-26'),
      profile_picture: 'https://path.com/daafsfda',
    };

    const createdProfile = await profileRepository.add(fakeprofile);

    const result = await connection.query('SELECT * FROM profiles WHERE id=?', [
      createdProfile.id,
    ]);

    const [foundprofile] = result[0];

    expect(createdProfile.id).toBeTruthy();
    expect(foundprofile.profilename).toBe(fakeprofile.profilename);
    expect(foundprofile.password).toBe(fakeprofile.password);
  });

  test('Should find all profiles in the database', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeUsers = [
      ['TesterJARIA', 'test123', 'test@bugmail', '2325232'],
      ['TesterSUPREM', 'test123', 'test111@bugmail', '2325855241'],
    ];

    const fakeprofiles = [
      [1, new Date('2005-02-4'), 'https://path.com/115fsda'],
      [2, new Date('2005-12-4'), 'https://path.com/dafsfda'],
    ];

    // Add fake users first
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [fakeUsers]
    );

    // Add user profiles
    await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [fakeprofiles]
    );

    const result = await profileRepository.findAllprofiles();

    expect(result.length).toBe(fakeprofiles.length);
  });

  test('Should find a profile by id', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeUsers = [
      ['TesterJARIA', 'test123', 'test@bugmail', '2325232'],
      ['TesterSUPREM', 'test123', 'test111@bugmail', '2325855241'],
    ];

    const fakeprofiles = [
      [1, new Date('2005-02-4'), 'https://path.com/115fsda'],
      [2, new Date('2005-12-4'), 'https://path.com/dafsfda'],
    ];

    // Add fake users first
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [fakeUsers]
    );

    // Add user profiles
    const [results] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [fakeprofiles]
    );

    const firstprofileId = results.insertId;
    const secondprofileId = results.insertId + 1;

    const foundFirstprofile = await profileRepository.findprofileById(
      firstprofileId
    );
    const foundSecondprofile = await profileRepository.findprofileById(
      secondprofileId
    );

    expect(foundFirstprofile.user_id).toBe(fakeprofiles[0][0]);
    expect(foundFirstprofile.birthday.getTime()).toBe(
      fakeprofiles[0][1].getTime()
    );

    expect(foundSecondprofile.user_id).toBe(fakeprofiles[1][0]);
    expect(foundSecondprofile.birthday.getTime()).toBe(
      fakeprofiles[1][1].getTime()
    );
  });

  test('Should find a profile by user_id', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeUsers = [
      ['TesterJARIA', 'test123', 'test@bugmail', '2325232'],
      ['TesterSUPREM', 'test123', 'test111@bugmail', '2325855241'],
    ];

    const fakeprofiles = [
      [1, new Date('2005-02-4'), 'https://path.com/115fsda'],
      [2, new Date('2005-12-4'), 'https://path.com/dafsfda'],
    ];

    // Add fake users first
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [fakeUsers]
    );

    // Add user profiles
    const [results] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [fakeprofiles]
    );

    const firstUseId = results.insertId;
    const secondUserId = results.insertId + 1;

    const foundFirstprofile = await profileRepository.findprofileByUserId(
      firstUseId
    );
    const foundSecondprofile = await profileRepository.findprofileByUserId(
      secondUserId
    );

    expect(foundFirstprofile.user_id).toBe(fakeprofiles[0][0]);
    expect(foundFirstprofile.birthday.getTime()).toBe(
      fakeprofiles[0][1].getTime()
    );

    expect(foundSecondprofile.user_id).toBe(fakeprofiles[1][0]);
    expect(foundSecondprofile.birthday.getTime()).toBe(
      fakeprofiles[1][1].getTime()
    );
  });
});
