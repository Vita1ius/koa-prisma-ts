import UserRepository from '../repositories/user.repository';
import { User } from '@prisma/client';
import { createHash } from 'crypto';
// const {createHash} = require('crypto')

class UserService{
    private userRepository: UserRepository;


    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(): Promise<User[]>{
        return this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<User | null> {
        return this.userRepository.findById(id);
    }
    
    async createUser(login:string,name: string,lastName: string,password: string, gmail: string): Promise<User>{
        const hashedPassword: string = await this.hash(password);
        return this.userRepository.create(login,name,lastName,hashedPassword,gmail);
    }
    async deleteUser(id: number):Promise<User | null>{
        return this.userRepository.delete(id)
    }
    async updateUser(id: number, data: Partial<User>): Promise<User | null> {
        return this.userRepository.update(id, data);
    }
    async login(login:string, password: string): Promise<User | null>{
        const user = await this.userRepository.login(login);
        if(user){
            const hashedPassword = await this.hash(password);
            if(hashedPassword === user.password){
                return user;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }


    async hash(password:string) : Promise<string>{
        const passwordHash = createHash('sha256').update(password).digest('hex');
        return passwordHash;
    }
}
export default UserService;