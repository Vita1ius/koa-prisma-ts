import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

class UserRepository{
    async findAll(): Promise<User[]>{
        return prisma.user.findMany();
    }
    async findById(id: number): Promise<User | null>{
        return prisma.user.findUnique({where:{id}})
    }
    async create(username:string,name: string,lastName: string,password: string, gmail: string): Promise<User> {
        return prisma.user.create({data:{ username,name,lastName,password,gmail }});
    }
    async delete(id: number): Promise<User | null>{
        return prisma.user.delete({where:{id}});
    }
    async update(id: number, data: Partial<User>): Promise<User | null> {
        return prisma.user.update({ where: { id }, data });
    }
    async login(username:string): Promise<User | null>{
        return prisma.user.findUnique({where:{
            username : username
        }})
    }
}

export default UserRepository;