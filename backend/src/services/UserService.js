const UserRepository = require('../repositories/UserRepository');
const ProfileRepository = require('../repositories/ProfileRepository');
const DuplicatedEmailError = require('./errors/DuplicatedEmailError');
const NotOwnerError = require('./errors/NotOwnerError');
const BcryptHelper = require('./helpers/BcryptHelper');
const NotFoundError = require('./errors/NotFoundError');
const serializeProfile = require('./helpers/serializeProfile');

class UserService {
  userRepository = new UserRepository();
  profileRepository = new ProfileRepository();

  async findById(id, authUserId) {
    if (id !== authUserId) {
      throw new NotOwnerError();
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const userProfile = await this.profileRepository.findByUserId(user.id);

    return {
      ...user,
      profile: userProfile,
    };
  }

  async findByEmail(email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const userProfile = await this.profileRepository.findByUserId(user.id);

    return {
      ...user,
      userProfile,
    };
  }
  async create(userData) {
    const { username, password, email, phone, birthday, profile_picture } =
      userData;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser && existingUser.email === email) {
      throw new DuplicatedEmailError(email);
    }

    const hashedPassword = await BcryptHelper.hashPassword(password);

    const createdUser = await this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      phone,
    });

    const birthdayDate = new Date(birthday);
    const createdProfile = await this.profileRepository.create({
      user_id: createdUser.id,
      birthday: birthdayDate,
      profile_picture,
    });

    delete createdUser.password;

    const serializedProfile = serializeProfile(createdProfile);

    return {
      ...createdUser,
      profile: serializedProfile,
    };
  }
}

module.exports = UserService;
