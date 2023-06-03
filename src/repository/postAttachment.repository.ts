import { PrismaClient,PostAttachment,Prisma } from "@prisma/client";
const prisma = new PrismaClient();

class PostAttachmentRepository{
  // async addImage(urls: string[], postId: number): Promise<PostAttachment[]> {
  //   const promises = urls.map(url =>
  //     prisma.postAttachment.create({
  //       data: {
  //         url,
  //         postId,
  //       },
  //     })
  //   );

  //   const results = await Promise.all(promises);
  //   return results;
  // }
  async addImage(url: string, postId: number): Promise<PostAttachment> {
    return prisma.postAttachment.create({
      data: {
        url,
        post: {
          connect: {
            id: postId,
          },
        },
      },
    })
  }


  // async addImage(urls: string[], postId: number): Promise<Prisma.BatchPayload> {
  //   const attachments = urls.map(url => ({
  //     url,
  //     postId
  //   }));
  
  //   return prisma.postAttachment.createMany({
  //     data: attachments,
  //   });
  // }
}

export default PostAttachmentRepository;