import authentication from '@/modules/authentication';
import { ValidationError } from '@/modules/errors';
import validator from '@/modules/validator';
import { IUserRepository } from '@/repositories/user-repository';
import { CreateUserRequest } from '@/models/user';

class UserService {
  readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async create(userData: CreateUserRequest) {
    const validUserData = await this.validatePostSchema(userData);

    await this.validateUniqueEmail(validUserData.email);
    await this.hashPasswordInObject(validUserData);

    const newUser = await this.userRepository.create(validUserData);

    return newUser;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOneByUsername(username);
    
    if (!user) {
      throw new ValidationError({
        message: 'Nenhum usuário encontrado para essas credenciais.',
        stack: new Error().stack,
        errorLocationCode: 'SERVICE:USER:VALIDATE_USER:ALREADY_EXISTS',
        key: 'email'
      });
    }

    return user;
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

  private validatePostSchema(postedUserData) {

    const cleanValues = validator(postedUserData, {
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      password: 'string',
      address: {
        street: 'string',
        city: 'string',
        state: 'string',
        zipCode: 'string'
      }
    });

    return cleanValues;
  }
}

export default UserService;
