import authentication from '@/modules/authentication';
import { ValidationError } from '@/modules/errors';
import validator from '@/modules/validator';

import { IUserRepository } from '@/repositories/user-repository';

type NewUserData = {
  email: string;
  username: string;
  name: string;
  password: string;
  avatar_url?: string;
};

class SessionService {
  readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(newUserData: NewUserData) {
    const validUserData = await this.validatePostSchema(newUserData);
    return validUserData;
    await this.validateUniqueUsername(validUserData.username);
    await this.validateUniqueEmail(validUserData.email);
    await this.hashPasswordInObject(validUserData);

    const newUser = await this.userRepository.create(validUserData);

    return newUser;
  }

  private async validateUniqueUsername(username: string) {
    const user = await this.userRepository.findOneByUsername(username);
    if (user) {
      throw new ValidationError({
        message: 'O "username" informado já está sendo usado.',
        stack: new Error().stack,
        errorLocationCode:
          'SERVICE:USER:VALIDATE_UNIQUE_USERNAME:ALREADY_EXISTS',
        key: 'username'
      });
    }
  }

  private async validateUniqueEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (user) {
      throw new ValidationError({
        message: 'O email informado já está sendo usado.',
        stack: new Error().stack,
        errorLocationCode: 'SERVICE:USER:VALIDATE_UNIQUE_EMAIL:ALREADY_EXISTS',
        key: 'email'
      });
    }
  }

  private async hashPasswordInObject(userObject) {
    userObject.password = await authentication.hashPassword(
      userObject.password
    );
    return userObject;
  }

  private validatePostSchema(postedUserData) {
    const cleanValues = validator(postedUserData, {
      username: 'required',
      email: 'required',
      password: 'required'
    });

    return cleanValues;
  }

}

export default SessionService;
