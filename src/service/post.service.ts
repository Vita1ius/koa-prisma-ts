import PostRepository from "../repository/post.repository";
import {Post} from "@prisma/client"

class PostService{
  private postRepository: PostRepository;
  
  constructor(){
    this.postRepository = new PostRepository();
  }
  async getAllPost(): Promise<Post[]>{
    return this.postRepository.findAll();
  }
  async getByIdUser(id: number): Promise<Post[]>{
    return this.postRepository.findByIdUser(id);
  }
  async getByid(id:number): Promise<Post | null>{
    return this.postRepository.findPostById(id);
  }
  async getByTitle(title: string): Promise<Post[]>{
    return this.postRepository.findPostsByTitle(title);
  }
  async update(
    id: number,
    data: Partial<Post>
  ): Promise<Post | null>{
    return this.postRepository.update(id,data);
  }
  async deteleById(id: number): Promise<Post | null>{
    return this.postRepository.delete(id);
  }
  async view(id:number):Promise<Post | null>{
    return this.postRepository.view(id);
  }
  async createPost(title: string,
    content: string,
    authorId: number
  ): Promise<Post> {
    return this.postRepository.createPost(
      title,
      content,
      authorId);
  }
}
export default PostService;