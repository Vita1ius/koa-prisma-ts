import { Context } from 'koa';
import { User } from '@prisma/client';
import UserService from '../service/user.service';

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
        const { login, name, lastName, password, gmail } = ctx.request.body as {
            login: string;
            password: string;
            gmail: string;
            name: string;
            lastName: string;
          };
      
        try {
          const user:User = await this.userService.createUser(login, name, lastName, password, gmail);
          ctx.status = 201;
          ctx.body = user;
        } catch (error) {
          ctx.status = 500;
          ctx.body = { error: 'Internal server error' };
        }
      }
    
    async deleteUser(ctx: Context):Promise<void>{
      const id: number = Number(ctx.params.id);
      // const deleteUser = await this.userService.deleteUser(id)
      // if(deleteUser){
      //   ctx.body = deleteUser;
      // }else{
      //   ctx.status = 404;
      //   ctx.body = {error: 'User not found'};
      // }
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
}
export default UserController;