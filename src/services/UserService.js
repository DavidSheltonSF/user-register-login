const UserRepository = require('../repositories/UserRepository');
const ProfileRepository = require('../repositories/ProfileRepository');

class UserService {
  async create(userData) {
    const { username, password, email, phone, birthday, profile_picture } =
      userData;

    const userRepository = new UserRepository();
    const profileRepository = new ProfileRepository();

    const [existingUser] = await userRepository.findUserByEmail(email);

    if (existingUser && existingUser.email === email) {
      throw Error(
        `DuplicatedEmailError: the email "${email}" is already associated to a user`
      );
    }

    try {
      const registredUser = await userRepository.add({
        username,
        password,
        email,
        phone,
      });

      const createdProfile = await profileRepository.add({
        user_id: registredUser.id,
        birthday,
        profile_picture,
      });

      return {
        ...registredUser,
        profile: createdProfile
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = UserService;
