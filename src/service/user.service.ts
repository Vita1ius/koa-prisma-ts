import UserRepository from '../repository/user.repository';
import { User, Post,Prisma } from '@prisma/client';
import { createHash } from 'crypto';

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
  
  async createUser(
    login:string,
    name: string,
    lastName: string,
    password: string,
    gmail: string
  ): Promise<User>{
    const hashedPassword: string = await this.hash(password);
    return this.userRepository.create(
      login,
      name,
      lastName,
      hashedPassword,
      gmail);
  }
  async deleteUser(id: number):Promise<User | null>{
    return this.userRepository.delete(id)
  }
  async updateUser(
    id: number,
    data: Partial<User>
  ): Promise<User | null> {
    return this.userRepository.update(id, data);
  }
  async login(
    username:string,
    password: string
  ): Promise<User | null>{
    const user = await this.userRepository.login(username);
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
  async signup(
    username:string,
    name: string,
    lastName: string,
    password: string, 
    gmail: string,
    posts: Prisma.PostCreateInput[]
  ):Promise<User>{
    const postData = posts
    ? posts.map((post: Prisma.PostCreateInput) => {
      return { title: post.title, content: post.content || undefined }
    })
    : []
    const hashedPassword: string = await this.hash(password);
    return this.userRepository.signup(
      username,
      name,
      lastName,
      hashedPassword,
      gmail,
      postData);
  }
  async getUserPostCount(){
    return this.userRepository.getUserPostCount();
  }
}
export default UserService;