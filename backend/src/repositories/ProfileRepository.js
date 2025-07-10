const MysqlConnector = require('./helper/MysqlConnector');

class ProfileRepository {
  connection = MysqlConnector.getInstance().getConnection();

  async findAllprofiles() {
    const result = await this.connection.query('SELECT * FROM profiles');
    return result[0];
  }

  async findprofileById(id) {
    const [result] = await this.connection.query(
      'SELECT * FROM profiles WHERE id=?',
      [id]
    );
    return result[0];
  }

  async findprofileByUserId(id) {
    const [result] = await this.connection.query(
      'SELECT * FROM profiles WHERE user_id=?',
      [id]
    );
    return result[0];
  }

  async add(profileData) {
    const { user_id, birthday, profile_picture } = profileData;

    let profileId = undefined;
    const [result] = await this.connection.query(
      `
      INSERT INTO profiles (user_id, birthday, profile_picture) VALUES (?, ?, ?)
    `,
      [user_id, birthday, profile_picture]
    );

    profileId = await result.insertId;

    const response = await this.connection.query(
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

module.exports = ProfileRepository;
