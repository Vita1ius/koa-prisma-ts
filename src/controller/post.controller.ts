import { Context } from 'koa';
import { Post } from '@prisma/client';
import PostRepository from "../repository/post.repository";
import logger from '../service/logger';
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
    logger.info(`Get all posts`);
    ctx.body = posts;
  }
  async getByAuthorId(ctx: Context): Promise<void>{
    const authorId = Number(ctx.params.authorId);
    try{
      const posts = await this.postRepository.findByIdUser(authorId);
      if(posts){
        logger.info(`Get posts by author ID: ${authorId}`);
        ctx.body = posts;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Posts not found'}
    }
    }catch(err){
      logger.error(`Error getting posts by author ID: ${err}`);
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async getPostById(ctx: Context): Promise<void>{
    const id = Number(ctx.params.id);
    try{
      const post = await this.postRepository.findPostById(id);
      if(post){
        logger.info(`Get post by ID: ${id}`);
        ctx.body = post;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Post not found'}
    }
    }catch(err){
      logger.error(`Error getting post by ID: ${err}`);
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async getPostByTitle(ctx: Context): Promise<void>{
    const { title } = ctx.request.body as { title: string };
    try{
      const post = await this.postRepository.findPostsByTitle(title);
      if(post){
        logger.info(`Get post by title: ${title}`);
        ctx.body = post;
      }else{
        ctx.status = 404;
        ctx.body = {error: 'Post not found'}
    }
    }catch(err){
      logger.error(`Error getting post by title: ${err}`);
      ctx.body = {error: 'Invalid request parameter'}
    }
  }
  async deletePost(ctx: Context):Promise<void>{
    const id: number = Number(ctx.params.id);
    try{
      const deletePost = await this.postRepository.delete(id);
      if(deletePost){
        logger.info(`Delete post with ID: ${id}`);
        ctx.body = deletePost;
      }
    }catch(err){
      logger.error(`Error deleting post: ${err}`);
      ctx.body = {error: 'Post not found'};
    }
  }
  async updatePost(ctx: Context): Promise<void> {
    try{
      const id = Number(ctx.params.id);
      const data = ctx.request.body as Partial<Post>;
      const updatedPost = await this.postRepository.update(id,data);
      if (updatedPost) {
        logger.info(`Update post with ID: ${id}`);
        ctx.body = updatedPost;
      } else {
        ctx.status = 404;
        ctx.body = { error: 'Post not found' };
      }
    }catch(err){
      logger.error(`Error updating post: ${err}`);
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

      //ctx.body = `Post '${createdPost.title} created successfully'`
      ctx.body = createdPost
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
      logger.info(`Send post to SQS: ${JSON.stringify(data)}`);
      ctx.body = { status: result.$metadata.httpStatusCode };
    } catch (error) {
      logger.error(`Error sending post to SQS: ${error}`);
      ctx.status = 500;
      ctx.body = { error: error };
    }
  }
}
export default PostController;