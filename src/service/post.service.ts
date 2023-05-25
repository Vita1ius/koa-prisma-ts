import PostRepository from "../repository/post.repository";
import {Post} from "@prisma/client"

class PostService{
    private postService: PostRepository;
    
    constructor(){
        this.postService = new PostRepository();
    }
    async getAllPost(): Promise<Post[]>{
        return this.postService.findAll();
    }
    async getByIdUser(id: number): Promise<Post[]>{
        return this.postService.findByIdUser(id);
    }
    async getByid(id:number): Promise<Post | null>{
        return this.postService.findPostById(id);
    }
    async getByTitle(title: string): Promise<Post[]>{
        return this.postService.findPostsByTitle(title);
    }
    async update(
        id: number,
        data: Partial<Post>
        ): Promise<Post | null>{
        return this.postService.update(id,data);
    }
    async deteleById(id: number): Promise<Post | null>{
        return this.postService.delete(id);
    }
    async view(id:number):Promise<Post | null>{
        return this.postService.view(id);
    }

}
export default PostService;
