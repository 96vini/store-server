import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import UserService from '@/services/user-service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IUser, CreateUserRequest } from '@/models/user';

interface ILoginRequest {
  username: string;
  password: string;
}

class SessionController {
  readonly userService: UserService;
  readonly jwt_secret_token: string;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: FastifyRequest, reply: FastifyReply) {
    
    try {
      const { 
        firstName, 
        lastName, 
        email,
        password, 
        address,
        cart
      } = req.body as IUser;
      
      if (!firstName || !lastName || !email || !password || !address) {
        return reply.status(400).send({ message: 'Todos os campos são obrigatórios' });
      }

      const formUserRegister = {
        firstName,
        lastName,
        email,
        password,
        address,
        cart
      } as CreateUserRequest;
      
      const newUser = await this.userService.create(formUserRegister);
      
      const access_token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return reply.status(201).send({ newUser, access_token });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return reply.status(500).send({ message: 'Erro ao criar usuário' });
    }
  }


  async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { username, password } = req.body as ILoginRequest;
  
      const user: IUser | null = await this.userService.findByUsername(username);

      if (!user) {
        return reply.status(401).send({ message: 'Credenciais inválidas' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Credenciais inválidas' });
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
