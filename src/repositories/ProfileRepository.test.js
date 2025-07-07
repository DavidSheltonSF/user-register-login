const ProfileRepository = require('./ProfileRepository');
const MysqlHelper = require('./helper/MysqlHelper');
const MysqlMapper = require('./helper/MysqlMapper');

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
    expect(foundprofile.user_id).toBe(fakeprofile.user_id);
    expect(foundprofile.birthday.getTime()).toBe(
      fakeprofile.birthday.getTime()
    );
    expect(foundprofile.profile_picture).toBe(fakeprofile.profile_picture);

  });

  test('Should find all profiles in the database', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeProfiles = [
      {
        user_id: 1,
        birthday: new Date('2005-02-4'),
        profile_picture: 'https://path.com/115fsda',
      },
      {
        user_id: 2,
        birthday: new Date('2005-12-4'),
        profile_picture: 'https://path.com/dafsfda',
      },
    ];

    const mappedFakeProfiles = MysqlMapper.mapProfiles(fakeProfiles);

    // Add user profiles
    await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [mappedFakeProfiles]
    );

    const result = await profileRepository.findAllprofiles();

    expect(result.length).toBe(fakeProfiles.length);

    expect(result[0].user_id).toBe(fakeProfiles[0].user_id);
    expect(result[0].birthday.getTime()).toBe(
      fakeProfiles[0].birthday.getTime()
    );
    expect(result[0].profile_picture).toBe(fakeProfiles[0].profile_picture);

    expect(result[1].user_id).toBe(fakeProfiles[1].user_id);
    expect(result[1].birthday.getTime()).toBe(
      fakeProfiles[1].birthday.getTime()
    );
    expect(result[1].profile_picture).toBe(fakeProfiles[1].profile_picture);
  });

  test('Should find a profile by id', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeProfiles = [
      {
        user_id: 1,
        birthday: new Date('2005-02-4'),
        profile_picture: 'https://path.com/115fsda',
      },
      {
        user_id: 2,
        birthday: new Date('2005-12-4'),
        profile_picture: 'https://path.com/dafsfda',
      },
    ];

    const mappedFakeProfiles = MysqlMapper.mapProfiles(fakeProfiles);

    // Add user profiles
    const [results] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [mappedFakeProfiles]
    );

    const profileId1 = results.insertId;
    const profileId2 = results.insertId + 1;

    const foundProfile1 = await profileRepository.findprofileById(profileId1);
    const foundProfile2 = await profileRepository.findprofileById(profileId2);

    expect(foundProfile1.user_id).toBe(fakeProfiles[0].user_id);
    expect(foundProfile1.birthday.getTime()).toBe(
      fakeProfiles[0].birthday.getTime()
    );

    expect(foundProfile2.user_id).toBe(fakeProfiles[1].user_id);
    expect(foundProfile2.birthday.getTime()).toBe(
      fakeProfiles[1].birthday.getTime()
    );
  });

  test('Should find a profile by user_id', async () => {
    const connection = await makeConnectionSUT();
    const profileRepository = new ProfileRepository();

    const fakeUsers = [
      {
        username: 'Jeronimo',
        password: 'jero123',
        email: 'jeronimo@bugmail.com',
        phone: '21585747874',
      },
      {
        username: 'Maria',
        password: 'mari123',
        email: 'maria@bugmail.com',
        phone: '21585747874',
      },
    ];

    const fakeProfiles = [
      {
        user_id: 1,
        birthday: new Date('2005-02-4'),
        profile_picture: 'https://path.com/115fsda',
      },
      {
        user_id: 2,
        birthday: new Date('2005-12-4'),
        profile_picture: 'https://path.com/dafsfda',
      },
    ];

    const mappedFakeUsers = MysqlMapper.mapUsers(fakeUsers);
    const mappedFakeProfiles = MysqlMapper.mapProfiles(fakeProfiles);

    // Add fake users first
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedFakeUsers]
    );

    // Add user profiles
    const [results] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [mappedFakeProfiles]
    );

    const userId1 = results.insertId;
    const userId2 = results.insertId + 1;

    const foundProfile1 = await profileRepository.findprofileByUserId(userId1);
    const foundProfile2 = await profileRepository.findprofileByUserId(userId2);

    expect(foundProfile1.user_id).toBe(userId1);
    expect(foundProfile1.user_id).toBe(fakeProfiles[0].user_id);
    expect(foundProfile1.birthday.getTime()).toBe(
      fakeProfiles[0].birthday.getTime()
    );
    expect(foundProfile1.profile_picture).toBe(fakeProfiles[0].profile_picture);

    expect(foundProfile2.user_id).toBe(userId2);
    expect(foundProfile2.user_id).toBe(fakeProfiles[1].user_id);
    expect(foundProfile2.birthday.getTime()).toBe(
      fakeProfiles[1].birthday.getTime()
    );
    expect(foundProfile2.profile_picture).toBe(fakeProfiles[1].profile_picture);
  });
});
