import { Context } from 'koa';
import { User, Post } from '@prisma/client';
import UserService from '../service/user.service';
import Email from '../../utils/email';
import { createHash,randomBytes } from 'crypto';

import jwt from 'jsonwebtoken';
const secretKey = 'your-secret-key'; // Secret key for JWT

class UserController {
  private userService : UserService;

  constructor(){
    this.userService  = new UserService();
  }

  async getAllUsers(ctx: Context): Promise<void> {
    const users = await this.userService.getAllUsers();
    ctx.body = users;
  }
  async getUserById(ctx: Context): Promise<void>{
    const id = Number(ctx.params.id);
    try{
      const user = await this.userService.getUserById(id);
      if(user){
        ctx.body = user;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'User not found'}
    }
    }catch(err){
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
      const user:User = await this.userService.createUser(username, name, lastName, password, gmail);
      ctx.status = 201;
      ctx.body = user;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
  
  async deleteUser(ctx: Context):Promise<void>{
    const id: number = Number(ctx.params.id);
    try{
      const deleteUser = await this.userService.deleteUser(id)
      if(deleteUser){
        ctx.body = deleteUser;
      }
    }catch(err){
      ctx.body = {error: 'User not found'};
    }
  }

  async updateUser(ctx: Context): Promise<void> {
    try{
      const id = Number(ctx.params.id);
      const data = ctx.request.body as Partial<User>;
      const updatedUser = await this.userService.updateUser(id, data);
      if (updatedUser) {
        ctx.body = updatedUser;
      } else {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
      }
    }catch(err){
      ctx.body = {error: 'Invalid request parameters'}
    }
    
  }

  async login(ctx: Context): Promise<void>{
    const {username, password} = ctx.request.body as {
      username: string;
      password: string;
    };
    const user = await this.userService.login(username,password);
    if(user){
      const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });
      ctx.body = { token };
    }else{
      ctx.status = 404;
      ctx.body = {error: 'Wrong login or password'}
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
      const user:User = await this.userService.signup(username, name, lastName, password, gmail,posts);
      ctx.status = 201;
      ctx.body = user;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
  async getUserPostCount(ctx: Context): Promise<void>{
    const users = await this.userService.getUserPostCount();
    ctx.body = users;
  }
  async send(ctx:Context): Promise<void>{
    const {email} = ctx.request.body as {
      email: string;
    };

    const user = await this.userService.getUserByEmail(email.toLowerCase());
    const message =
      'You will receive a reset email if user with that email exist';
    if (user) {
      ctx.status = 200;
      ctx.body ={status: 'success', message : message}
      const resetToken = randomBytes(32).toString('hex');
      const passwordResetToken = await this.userService.hash(resetToken);

      await this.userService.updateUser(
        user.id,
        {
          passwordResetToken,
          passwordResetAt: new Date(Date.now() + 10 * 60 * 1000),
        }
      );
      try {
        const url = `http://localhost:3000/resetPassword/${resetToken}`;
        await new Email(user, url).sendPasswordResetToken();
  
        ctx.status = 200;
        ctx.body ={status: 'success', message : message}
      } catch (err: any) {
        await this.userService.updateUser(
          user.id,
          { passwordResetToken: null, passwordResetAt: null },
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
        const passwordResetToken = await this.userService.hash(resetToken);
        const user = await this.userService.findUserByResetToken(passwordResetToken);
        if (!user) {
          ctx.status = 403;
          ctx.body = {status: 'fail',
          message: 'Invalid token or token has expired'}
        }
        else {
          const hashedPassword = await this.userService.hash(password);
          await this.userService.updateUser(user.id,{
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetAt: null,
        })
        ctx.status = 200;
        ctx.body = {status: 'success',
        message: 'Password data updated successfully',}
        }
      }catch(err){
        ctx.body = 'err';
      }
    }
}
export default UserController;