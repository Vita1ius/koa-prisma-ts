import { Context } from 'koa';
import PostAttachmentService from '../service/postAttachment.service';
import { s3Uploadv3,getObjectSignedUrl, deleteFile } from '../s3/s3.service';
import jwt from 'jsonwebtoken';
const secretKey = 'your-secret-key'; // Secret key for JWT


class PostAttachmentController{
  private postAttachmentService: PostAttachmentService;
  constructor(){
    this.postAttachmentService = new PostAttachmentService();
  }
  async upload(ctx:any): Promise<void>{
    //const { userId, postId } = ctx.request.body as { userId: number, postId: number };
    const formData = ctx.request.body;
    const postId = Number(formData.postId);
    const token = ctx.request.headers.authorization!.split(' ')[1];

    try {
      const decodedToken = jwt.verify(token, secretKey) as { user: { id: number } };
      const userId = decodedToken.user.id;
      if(ctx.request.files && ctx.request.files.length > 0){
        const results = await s3Uploadv3(ctx.request.files,userId,postId);
        results.map(url => this.postAttachmentService.addImage(url,postId))

        ctx.status = 201;
        ctx.body = { status: 'uploaded' };
      }else{
        ctx.body = { status: 'file is empty' };
      }
    } catch (err) {
      ctx.status = 404
      ctx.body = err
    }
  }
  async getImages(ctx:Context):Promise<void>{
    const postId = Number(ctx.params.postId);
    const posts = await this.postAttachmentService.getByIPostId(postId)
    for (let post of posts) {
      post.url = await getObjectSignedUrl(post.url)
    }
    ctx.body = posts;
  }
  async deleteImageById(ctx: Context): Promise<void>{
    try{
      const id = Number(ctx.params.id);
      const image = await this.postAttachmentService.deteleById(id);
      if(image){
        await deleteFile(image.url)
        ctx.body = {status: 'Image deleted successfully'}
      }else ctx.body = {status: 'Image not found'}
    }catch(err){
      ctx.status = 404;
      ctx.body = err
    }

  }
}
export default PostAttachmentController;