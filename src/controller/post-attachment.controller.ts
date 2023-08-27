import { Context } from 'koa';
import PostRepository from "../repository/post.repository";
import PostAttachmentRepository from "../repository/postAttachment.repository";
import { s3Uploadv3,getObjectSignedUrl, deleteFile } from '../service/aws-s3';
import logger from '../service/logger';

class PostAttachmentController{
  private postAttachmentRepository: PostAttachmentRepository;
  private postRepository: PostRepository;
  constructor(){
    this.postAttachmentRepository = new PostAttachmentRepository();
    this.postRepository = new PostRepository();
  }
  async upload(ctx:any): Promise<void>{
    const formData = ctx.request.body;
    const postId = Number(formData.postId);
    try{
      const post = await this.postRepository.findPostById(postId);
      if(post){
        try {
          const userId = ctx.state.user.id;
          if(ctx.request.files && ctx.request.files.length > 0){
            const results = await s3Uploadv3(ctx.request.files,userId,postId);
            results.map(url => this.postAttachmentRepository.addImage(url,postId))
    
            logger.info(`Files uploaded for post ID: ${postId}`);
            ctx.status = 201;
            ctx.body = { status: 'uploaded' };
          }else{
            ctx.body = { status: 'file is empty' };
          }
        } catch (err) {
          logger.error(`Error uploading files for post ID ${postId}: ${err}`);
          ctx.status = 404
          ctx.body = err
        }
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Post not found'}
    }
    }catch(err){
      logger.error(`Error getting post by ID for upload: ${err}`);
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async getImages(ctx:Context):Promise<void>{
    const postId = Number(ctx.params.postId);
    const posts = await this.postAttachmentRepository.findByPostId(postId);
    for (let post of posts) {
      post.url = await getObjectSignedUrl(post.url)
    }
    logger.info(`Get images for post ID: ${postId}`);
    ctx.body = posts;
  }
  async deleteImageById(ctx: Context): Promise<void>{
    try{
      const id = Number(ctx.params.id);
      const image = await this.postAttachmentRepository.delete(id);
      if(image){
        await deleteFile(image.url)
        logger.info(`Delete image with ID: ${id}`);
        ctx.body = {status: 'Image deleted successfully'}
      }else ctx.body = {status: 'Image not found'}
    }catch(err){
      logger.error(`Error deleting image: ${err}`);
      ctx.status = 404;
      ctx.body = err
    }

  }
}
export default PostAttachmentController;