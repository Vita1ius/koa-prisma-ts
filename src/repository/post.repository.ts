import { PrismaClient,Post } from "@prisma/client";
const prisma = new PrismaClient();

class PostRepository{
    async findAll():Promise<Post[]>{
        return prisma.post.findMany();
    }
    async findByIdUser(id: number):Promise<Post[]>{
        return prisma.post.findMany({
            where:{
                authorId : id
            }
        });
    }
    async findPostById(id: number):Promise<Post | null>{
        return prisma.post.findUnique({
            where:{
                id: id
            }
        });
    }
    async findPostsByTitle(title: string):Promise<Post[]>{
        return prisma.post.findMany({
            where:{
              title: title
            }
          });
    }
    async update(id: number,data: Partial<Post>): Promise<Post | null>{
        return prisma.post.update({
            where:{
                id: id
            },
            data
        });
    }
    async delete(id: number): Promise<Post | null>{
        return prisma.post.delete({
            where:{
                id:id
            }
        });
    }
    async view(id: number): Promise<Post | null>{
        return prisma.post.update({
            where: {
              id,
            },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          });
    }

}


export default PostRepository;