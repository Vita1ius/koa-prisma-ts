import { PrismaClient,PostAttachment } from "@prisma/client";
const prisma = new PrismaClient();

class PostAttachmentRepository{

  async addImage(url: string, postId: number): Promise<PostAttachment> {
    return prisma.postAttachment.create({
      data: {
        url,
        post: {
          connect: {
            id: postId,
          }
        }
      }
    });
  }

  async findByPostId(postId: number):Promise<PostAttachment[]>{
    return prisma.postAttachment.findMany({
      where: {
        postId : postId
      }
    });
  }

  async delete(id: number): Promise<PostAttachment | null>{
    return prisma.postAttachment.delete({
      where:{
        id:id
      }
    });
  }
}

export default PostAttachmentRepository;