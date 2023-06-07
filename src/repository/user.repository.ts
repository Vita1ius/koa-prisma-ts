import { PrismaClient, User, Prisma } from "@prisma/client";
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
  async findByEmail(email: string): Promise<User | null>{
    return prisma.user.findUnique({
      where: {
        email
      }
    })
  }
  async findUserByResetToken(passwordResetToken:string): Promise<User | null>{
    return prisma.user.findFirst({
      where: {
        passwordResetToken,
        passwordResetAt: {
          gt: new Date()
        }
      }
    })
  }
  async create(
    username:string,
    name: string,
    lastName: string,
    password: string,
    email: string
    ): Promise<User> {
    return prisma.user.create({
      data:{ 
        username,
        name,
        lastName,
        password,
        email
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
    email: string,
    posts: Prisma.PostCreateInput[]
  ): Promise<User>{
    return await prisma.user.create({
    data: {
      username,
      name,
      lastName,
      password,
      email,
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