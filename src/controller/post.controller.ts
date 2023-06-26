import { Context } from 'koa';
import { Post } from '@prisma/client';
import PostRepository from "../repository/post.repository";
const dotenv = require('dotenv');
const { SQSClient, SendMessageCommand} = require('@aws-sdk/client-sqs')
dotenv.config();

const conifgObject = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}
const sqsClient = new SQSClient(conifgObject);
const queueUrl = process.env.QUEUE_URL || '';


class PostController{
  private postRepository: PostRepository;
  constructor(){
    this.postRepository = new PostRepository();
  }
  async getAll(ctx: Context): Promise<void> {
    const posts = await this.postRepository.findAll();
    ctx.body = posts;
  }
  async getByAuthorId(ctx: Context): Promise<void>{
    const authorId = Number(ctx.params.authorId);
    try{
      const posts = await this.postRepository.findByIdUser(authorId);
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
      const post = await this.postRepository.findPostById(id);
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
      const post = await this.postRepository.findPostsByTitle(title);
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
      const deletePost = await this.postRepository.delete(id);
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
      const updatedPost = await this.postRepository.update(id,data);
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
      const post = await this.postRepository.view(id);

      ctx.body = post
    } catch {
      ctx.status = 404
      ctx.body = { error: 'Post not found' }
    }
  }
  async createPost(ctx: Context) {
    try {
      const authorId = ctx.state.user.id;
      const { title, content } = ctx.request.body as { title: string, content: string};
      const createdPost = await this.postRepository.createPost(
        title,
        content,
        authorId);

      ctx.body = `Post '${createdPost.title} created successfully'`
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }

  async createPostBySQS(data: Object) {
    try {
      const { title, content,authorId } = data as { title: string, content: string, authorId : number };
      const createdPost = await await this.postRepository.createPost(
        title,
        content,
        authorId);
      
      console.log(createdPost);
    } catch (error) {
      console.log(error);
    }
  }

  async sendPostToSQS(ctx: Context) {
    const { title, content } = ctx.request.body as { title: string, content: string };
    try {
      const authorId = ctx.state.user.id;
      const data = {
        title : title,
        content : content,
        authorId : authorId
      }
      const command = new SendMessageCommand({
        MessageBody : JSON.stringify(data),
        QueueUrl: queueUrl,
      })
      const result = await sqsClient.send(command);
      console.log(result);
      ctx.body = { status: result.$metadata.httpStatusCode };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error };
    }
  }
}
export default PostController;