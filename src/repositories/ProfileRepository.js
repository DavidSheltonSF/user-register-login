const MysqlHelper = require('./helper/MysqlHelper');

class profileRepository {
  databaseHandler = MysqlHelper.create();

  async findAllprofiles() {
    const connection = this.databaseHandler.getConnection();

    const result = await connection.query('SELECT * FROM profiles');

    return result[0];
  }

  async findprofileById(id) {
    const connection = this.databaseHandler.getConnection();

    const [result] = await connection.query('SELECT * FROM profiles WHERE id=?', [
      id,
    ]);

    return result[0];
  }

  async findprofileByUserId(id) {
    const connection = this.databaseHandler.getConnection();

    const [result] = await connection.query('SELECT * FROM profiles WHERE user_id=?', [
      id,
    ]);

    console.log(result);
    return result[0];
  }

  async add(profileData) {
    const connection = this.databaseHandler.getConnection();

    const { user_id, birthday, profile_picture } = profileData;

    let profileId = undefined;
    const [result] = await connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES (?, ?, ?)
    `,
      [user_id, birthday, profile_picture]
    );

    profileId = await result.insertId;

    const response = await connection.query(
      'SELECT * FROM profiles WHERE id=?',
      [profileId]
    );

    if (response[0].length === 0) {
      return null;
    }

    const [foundprofile] = response[0];

    return {
      id: profileId,
      ...foundprofile,
    };
  }
}

module.exports = profileRepository;
