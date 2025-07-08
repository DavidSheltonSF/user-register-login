const UserRepository = require('../repositories/UserRepository');
const ProfileRepository = require('../repositories/ProfileRepository');
const DuplicatedEmailError = require('./errors/DuplicatedEmailError');
const NotOwnerError = require('./errors/NotOwnerError');
const BcryptHelper = require('./helpers/BcryptHelper');

class UserService {
  async create(userData) {
    const { username, password, email, phone, birthday, profile_picture } =
      userData;

    const hashedPassword = await BcryptHelper.hashPassword(password);

    const userRepository = new UserRepository();
    const profileRepository = new ProfileRepository();

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser && existingUser.email === email) {
      throw new DuplicatedEmailError(email);
    }
    
    try {
      const registredUser = await userRepository.add({
        username,
        password: hashedPassword,
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
        profile: createdProfile,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async findById(id, authUserId) {
    if (id !== authUserId) {
      throw new NotOwnerError();
    }

    const userRepository = new UserRepository();
    const profileRepository = new ProfileRepository();

    const user = await userRepository.findUserById(id);

    if (!user) {
      return null;
    }

    const userProfile = await profileRepository.findprofileByUserId(user.id);
    return {
      ...user,
      profile: userProfile,
    };
  }

  async findByEmail(email) {
    const userRepository = new UserRepository();
    const profileRepository = new ProfileRepository();

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const userProfile = await profileRepository.findprofileByUserId(user.id);

    return {
      ...user,
      userProfile,
    };
  }
}

module.exports = UserService;
