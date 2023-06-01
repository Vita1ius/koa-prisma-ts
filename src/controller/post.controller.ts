import { Context } from 'koa';
import { Post } from '@prisma/client';
import PostService from '../service/post.service';

class PostController{
  private postService: PostService;
  constructor(){
    this.postService = new PostService();
  }
  async getAll(ctx: Context): Promise<void> {
    const posts = await this.postService.getAllPost();
    ctx.body = posts;
  }
  async getByAuthorId(ctx: Context): Promise<void>{
    const authorId = Number(ctx.params.authorId);
    try{
      const posts = await this.postService.getByIdUser(authorId);
      if(posts){
        ctx.body = posts;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Posts not found'}
    }
    }catch(err){
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async getPostById(ctx: Context): Promise<void>{
    const id = Number(ctx.params.id);
    try{
      const post = await this.postService.getByid(id);
      if(post){
        ctx.body = post;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Post not found'}
    }
    }catch(err){
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async getPostByTitle(ctx: Context): Promise<void>{
    const { title } = ctx.request.body as { title: string };
    try{
      const post = await this.postService.getByTitle(title);
      if(post){
        ctx.body = post;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Post not found'}
    }
    }catch(err){
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async deletePost(ctx: Context):Promise<void>{
    const id: number = Number(ctx.params.id);
    try{
      const deletePost = await this.postService.deteleById(id);
      if(deletePost){
        ctx.body = deletePost;
      }
    }catch(err){
      ctx.body = {error: 'Post not found'};
    }
  }
  async updatePost(ctx: Context): Promise<void> {
    try{
      const id = Number(ctx.params.id);
      const data = ctx.request.body as Partial<Post>;
      const updatedPost = await this.postService.update(id, data);
      if (updatedPost) {
        ctx.body = updatedPost;
      } else {
        ctx.status = 404;
        ctx.body = { error: 'Post not found' };
      }
    }catch(err){
      ctx.body = {error: 'Invalid request parameters'}
    }
  }
  async view(ctx: Context): Promise<void>{
    const id = Number(ctx.params.id)

    try {
      const post = await this.postService.view(id);

      ctx.body = post
    } catch {
      ctx.status = 404
      ctx.body = { error: 'Post not found' }
    }
  }
}
export default PostController;