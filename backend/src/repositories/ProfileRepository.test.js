const ProfileRepository = require('./ProfileRepository');
const MysqlConnector = require('./helper/MysqlConnector');
const objectsToValuesArrays = require('./helper/objectsToValuesArrays');

describe('Testing ProfileRepository', () => {
  const mysqlHelper = MysqlConnector.getInstance();
  const connection = mysqlHelper.getConnection();

  beforeEach(async () => {
    try {
      await connection.execute('TRUNCATE TABLE profiles');
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    connection.end();
  });

  test('Should find all profiles in the database', async () => {
    const profileRepository = new ProfileRepository();

    const profiles = [
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

    const mappedProfiles = objectsToValuesArrays(profiles);

    // create user profiles
    await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [mappedProfiles]
    );

    const result = await profileRepository.findAll();

    expect(result.length).toBe(profiles.length);

    expect(result[0].user_id).toBe(profiles[0].user_id);
    expect(result[0].birthday.getTime()).toBe(profiles[0].birthday.getTime());
    expect(result[0].profile_picture).toBe(profiles[0].profile_picture);

    expect(result[1].user_id).toBe(profiles[1].user_id);
    expect(result[1].birthday.getTime()).toBe(profiles[1].birthday.getTime());
    expect(result[1].profile_picture).toBe(profiles[1].profile_picture);
  });

  test('Should find a profile by id', async () => {
    const profileRepository = new ProfileRepository();

    const profiles = [
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

    const mappedProfiles = objectsToValuesArrays(profiles);

    // create user profiles
    const [results] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [mappedProfiles]
    );

    const profileId1 = results.insertId;
    const profileId2 = results.insertId + 1;

    const foundProfile1 = await profileRepository.findById(profileId1);
    const foundProfile2 = await profileRepository.findById(profileId2);

    expect(foundProfile1.user_id).toBe(profiles[0].user_id);
    expect(foundProfile1.birthday.getTime()).toBe(
      profiles[0].birthday.getTime()
    );
    expect(foundProfile1.profile_picture).toBe(profiles[0].profile_picture);

    expect(foundProfile2.user_id).toBe(profiles[1].user_id);
    expect(foundProfile2.birthday.getTime()).toBe(
      profiles[1].birthday.getTime()
    );
    expect(foundProfile2.profile_picture).toBe(profiles[1].profile_picture);
  });

  test('Should find a profile by user_id', async () => {
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

    const profiles = [
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

    const mappedFakeUsers = objectsToValuesArrays(fakeUsers);
    const mappedProfiles = objectsToValuesArrays(profiles);

    // create fake users first
    await connection.query(
      `
      INSERT INTO users (username, password, email, phone) VALUES ?
    `,
      [mappedFakeUsers]
    );

    // create user profiles
    const [results] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES ?
    `,
      [mappedProfiles]
    );

    const userId1 = results.insertId;
    const userId2 = results.insertId + 1;

    const foundProfile1 = await profileRepository.findByUserId(userId1);
    const foundProfile2 = await profileRepository.findByUserId(userId2);

    expect(foundProfile1.user_id).toBe(userId1);
    expect(foundProfile1.user_id).toBe(profiles[0].user_id);
    expect(foundProfile1.birthday.getTime()).toBe(
      profiles[0].birthday.getTime()
    );
    expect(foundProfile1.profile_picture).toBe(profiles[0].profile_picture);

    expect(foundProfile2.user_id).toBe(userId2);
    expect(foundProfile2.user_id).toBe(profiles[1].user_id);
    expect(foundProfile2.birthday.getTime()).toBe(
      profiles[1].birthday.getTime()
    );
    expect(foundProfile2.profile_picture).toBe(profiles[1].profile_picture);
  });

  test('Should create a new profile in the database', async () => {
    const profileRepository = new ProfileRepository();

    const profile = {
      user_id: 1,
      birthday: new Date('2002-02-26'),
      profile_picture: 'https://path.com/daafsfda',
    };

    const createdProfile = await profileRepository.create(profile);

    const result = await connection.query('SELECT * FROM profiles WHERE id=?', [
      createdProfile.id,
    ]);

    const [foundprofile] = result[0];

    expect(createdProfile.id).toBeTruthy();
    expect(foundprofile.user_id).toBe(profile.user_id);
    expect(foundprofile.birthday.getTime()).toBe(profile.birthday.getTime());
    expect(foundprofile.profile_picture).toBe(profile.profile_picture);
  });
});
