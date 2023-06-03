import { Context } from 'koa';
import { PostAttachment } from '@prisma/client';
import PostAttachmentService from '../service/postAttachment.service';
import { s3Uploadv3 } from '../../s3.service';
import { integer } from 'aws-sdk/clients/cloudfront';


class PostAttachmentController{
  private postAttachmentService: PostAttachmentService;
  constructor(){
    this.postAttachmentService = new PostAttachmentService();
  }
  async upload(ctx:any): Promise<void>{
    //const { userId, postId } = ctx.request.body as { userId: number, postId: number };
    const formData = ctx.request.body;
    const userId = Number(formData.userId);
    const postId = Number(formData.postId);


    try {
      const results = await s3Uploadv3(ctx.request.files,userId,postId);
       results.map(url => this.postAttachmentService.add(url,postId))
      // const postAttachments = await this.postAttachmentService.add(results[0],postId)
      //  console.log(postAttachments);
      
      ctx.body = { status: 'success' };
      //ctx.body = postAttachments;
    } catch (err) {
      ctx.status = 404
      ctx.body = err
    }
  }
}
export default PostAttachmentController;