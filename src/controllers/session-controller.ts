import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserService from '@/services/user-service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ICreateUserRequest } from '@/interfaces/user';
import { ILoginRequest } from '@/interfaces/session';

class SessionController {
  readonly userService: UserService;
  readonly jwt_secret_token: string;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: FastifyRequest, reply: FastifyReply) {
    
    try {
      const { 
        first_name,
        middle_name,
        last_name,
        username,
        phone,
        password,
        addresses,
        avatar_url
      } = req.body as ICreateUserRequest;
      
      if (!first_name) {
        return reply.status(400).send({ message: 'Error: no one first name specified in request' });
      }

      if(!last_name) {
        return reply.status(400).send({ message: 'Error: no one last name specified in request' });
      }

      if(!username) {
        return reply.status(400).send({ message: 'Error: no one last name specified in request' });
      }

      if(!password) {
        return reply.status(400).send({ message: 'Error: no one password specified in request' });
      }

      if(!addresses) {
        return reply.status(400).send({ message: 'Error: no one address specified in request' });
      }
      
      const newUser = await this.userService.create(
        {
          first_name, 
          middle_name,
          last_name,
          phone,
          password, 
          addresses,
          avatar_url,
        } as ICreateUserRequest
      );
      
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return reply.status(201).send({ newUser, token });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return reply.status(500).send({ message: 'Erro ao criar usuário' });
    }
  }


  async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { username, password } = req.body as ILoginRequest;
      
      const user = await this.userService.findByUsername(username);

      console.log(user);

      if (!user) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Wrong password' });
      }
      
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      return reply.status(200).send({ user, token });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return reply.status(500).send({ message: 'Erro ao fazer login' });
    }
  }
}

export default SessionController;
