import PostAttachmentRepository from "../repository/postAttachment.repository";

import {PostAttachment} from "@prisma/client"

class PostAttachmentService{
  private postAttachmentRepository: PostAttachmentRepository;
  
  constructor(){
    this.postAttachmentRepository = new PostAttachmentRepository();
  }
  async addImage(
    url: string,
    postId: number
  ): Promise<PostAttachment> {
    return this.postAttachmentRepository.addImage(
      url,
      postId);
  }
  async getByIPostId(postId: number): Promise<PostAttachment[]>{
    return this.postAttachmentRepository.findByPostId(postId);
  }
}
export default PostAttachmentService;