class MysqlMapper {
  /**
   *
   * @param {Object[]} users in an array of objects
   * @returns {Array[]} users in an array of arrays
   */
  static mapUsers(users) {
    return users.map((user) => {
      const mappedUser = [];
      mappedUser.push(user.username);
      mappedUser.push(user.password);
      mappedUser.push(user.email);
      mappedUser.push(user.phone);

      return mappedUser;
    });
  }

  /**
   *
   * @param {Object[]} profiles in an array of objects
   * @returns {Array[]} profiles in an array of arrays
   */
  static mapProfiles(profiles) {
    return profiles.map((profile) => {
      const mappedProfile = [];
      mappedProfile.push(profile.user_id);
      mappedProfile.push(profile.birthday);
      mappedProfile.push(profile.profile_picture);

      return mappedProfile;
    });
  }
}

module.exports = MysqlMapper;
