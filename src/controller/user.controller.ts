import { Context } from 'koa';
import { User, Post, Prisma } from '@prisma/client';
import Email from '../service/mailer';
import UserRepository from '../repository/user.repository';
import { randomBytes } from 'crypto';
import {hash} from '../service/password-hasher'
import logger from '../service/logger';

import jwt from 'jsonwebtoken';
const secretKey = 'your-secret-key'; // Secret key for JWT

class UserController {
  private userRepository: UserRepository;

  constructor(){
    this.userRepository = new UserRepository();
  }

  async getAllUsers(ctx: Context): Promise<void> {
    const users = await this.userRepository.findAll();
    logger.info('Fetching all users');
    ctx.body = users;
  }
  async getUserById(ctx: Context): Promise<void>{
    const id = Number(ctx.params.id);
    try{
      const user = await this.userRepository.findById(id);
      if(user){
        logger.info(`Fetching user by ID: ${id}`);
        ctx.body = user;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'User not found'}
    }
    }catch(err){
      logger.error(`Error fetching user by ID: ${err}`);
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async  createUser(ctx: Context): Promise<void> {
    const { username, name, lastName, password, gmail } = ctx.request.body as {
      username: string;
      password: string;
      gmail: string;
      name: string;
      lastName: string;
    };
  
    try {
      const hashedPassword: string = await hash(password);
      const user:User = await this.userRepository.create(
        username,
        name,
        lastName,
        hashedPassword,
        gmail);

      logger.info(`User created: ${user.username}`);
      ctx.status = 201;
      ctx.body = user;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
  
  async deleteUser(ctx: Context):Promise<void>{
    const id: number = Number(ctx.params.id);
    try{
      const deleteUser = await this.userRepository.delete(id);
      if(deleteUser){
        logger.info(`User deleted: ${id}`);
        ctx.body = deleteUser;
      }
    }catch(err){
      logger.error(`Error deleting user: ${err}`);
      ctx.body = {error: 'User not found'};
    }
  }

  async updateUser(ctx: Context): Promise<void> {
    try{
      const id = Number(ctx.params.id);
      const data = ctx.request.body as Partial<User>;
      const updatedUser = await this.userRepository.update(id, data);
      if (updatedUser) {
        logger.info(`User updated: ${id}`);
        ctx.body = updatedUser;
      } else {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
      }
    }catch(err){
      logger.error(`Error updating user: ${err}`);
      ctx.body = {error: 'Invalid request parameters'}
    }
    
  }

  async login(ctx: Context): Promise<void>{
    const {username, password} = ctx.request.body as {
      username: string;
      password: string;
    };
    logger.info(`Login attempt: Username - ${username}, Password - ${password}`);
    const user = await this.userRepository.login(username);
    if(user){
      const hashedPassword = await hash(password);
      if(hashedPassword === user.password){
        const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });
        logger.info(`Successful login for user ${username}`);
      ctx.body = { token };
      }else{
        logger.warn(`Wrong password for username: ${username}`)
        ctx.status = 404;
        ctx.body = {error: 'Wrong password'}
      }
    }else{
      logger.warn(`Wrong username: ${username}`);   
      ctx.status = 404;
      ctx.body = {error: 'Wrong username'}
    }
  }
  async  signup(ctx: Context): Promise<void> {
    const { username, name, lastName, password, gmail, posts } = ctx.request.body as {
      username: string;
      password: string;
      gmail: string;
      name: string;
      lastName: string;
      posts: Post[]
    };
  
    try {
      const postData = posts
      ? posts.map((post: Prisma.PostCreateInput) => {
        return { title: post.title, content: post.content || undefined }
      })
      : []
      const hashedPassword: string = await hash(password);
      const user:User = await this.userRepository.signup(
        username,
        name,
        lastName,
        hashedPassword,
        gmail,
        postData);

      logger.info(`User signed up: ${username}`);
      ctx.status = 201;
      ctx.body = user;
    } catch (error) {
      logger.info(`User signed up: ${username}`);
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
  async getUserPostCount(ctx: Context): Promise<void>{
    const users = await this.userRepository.getUserPostCount();
    logger.info('Fetching user post counts');
    ctx.body = users;
  }
  async sendPasswordResetEmail(ctx:Context): Promise<void>{
    const {email} = ctx.request.body as {
      email: string;
    };

    const user = await this.userRepository.findByEmail(email.toLowerCase());
    const message =
      'You will receive a reset email if user with that email exist';
    if (user) {
      logger.info(`Sending password reset email to ${email}`);
      ctx.status = 200;
      ctx.body ={status: 'success', message : message}
      const resetToken = randomBytes(32).toString('hex');
      const passwordResetToken = await hash(resetToken);

      await this.userRepository.update(
        user.id,
        {
          passwordResetToken,
          passwordResetExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
        }
      );
      try {
        const url = `http://localhost:3000/resetPassword/${resetToken}`;
        await new Email(user, url).sendPasswordResetToken();
  
        ctx.status = 200;
        ctx.body ={status: 'success', message : message}
      } catch (err: any) {
        await this.userRepository.update(
          user.id,
          { passwordResetToken: null, passwordResetExpiredAt: null },
        );
        ctx.status = 500;
        ctx.body ={status: 'success', message : 'There was an error sending email'}
        };
    }else{
        ctx.status = 404;
        ctx.body = {status:'This email isn\'t registered or is incorrect'}
      }
    }

    async resetPasswordHandler(ctx:Context):Promise<void>{
      const resetToken = ctx.params.resetToken;
      const {password} = ctx.request.body as {
        password: string;
      };
      try{
        const passwordResetToken = await hash(resetToken);
        const user = await this.userRepository.findUserByResetToken(passwordResetToken);
        if (!user) {
          ctx.status = 403;
          ctx.body = {status: 'fail',
          message: 'Invalid token or token has expired'}
        }
        else {
          const hashedPassword = await hash(password);
          await this.userRepository.update(user.id,{
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpiredAt: null,
        })
        logger.info(`Password reset for user ${user.username}`);
        ctx.status = 200;
        ctx.body = {status: 'success',
        message: 'Password data updated successfully',}
        }
      }catch(err){
        logger.error(`Error resetting password: ${err}`);
        ctx.body = 'err';
      }
    }
}
export default UserController;