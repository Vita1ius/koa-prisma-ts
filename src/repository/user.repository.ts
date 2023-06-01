import { PrismaClient, User, Post, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

class UserRepository{
  async findAll(): Promise<User[]>{
    return prisma.user.findMany();
  }
  async findById(id: number): Promise<User | null>{
  return prisma.user.findUnique({
    where: {
      id
    }
  })
  }
  async create(
    username:string,
    name: string,
    lastName: string,
    password: string,
    gmail: string
    ): Promise<User> {
    return prisma.user.create({
      data:{ 
        username,
        name,
        lastName,
        password,
        gmail
      }
    });
  }
  async delete(id: number): Promise<User | null>{
    return prisma.user.delete({
      where: {
        id
      }
    });
  }
  async update(
    id: number,
    data: Partial<User>
    ): Promise<User | null> {
    return prisma.user.update({
      where: {
        id
      },
      data
    });
  }
  async login(username:string): Promise<User | null>{
    return prisma.user.findUnique({
      where: {
        username : username
      }
    });
  }
  async signup(
    username:string,
    name: string,
    lastName: string,
    password: string,
    gmail: string,
    posts: Prisma.PostCreateInput[]
  ): Promise<User>{
    return await prisma.user.create({
    data: {
      username,
      name,
      lastName,
      password,
      gmail,
      posts: {
        create: posts,
      },
    },
    });
  }
  async getUserPostCount(){
    return await prisma.user.findMany({
      select: {
        username: true,
        _count: {
          select: { posts: true },
        },
      },
    })
  }
}

export default UserRepository;