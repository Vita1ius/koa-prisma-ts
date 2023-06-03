import PostAttachmentRepository from "../repository/postAttachment.repository";

import {PostAttachment} from "@prisma/client"

class PostAttachmentService{
  private postAttachmentRepository: PostAttachmentRepository;
  
  constructor(){
    this.postAttachmentRepository = new PostAttachmentRepository();
  }
  async add(
    url: string,
    postId: number
  ): Promise<PostAttachment> {
    return this.postAttachmentRepository.addImage(
      url,
      postId);
  }
}
export default PostAttachmentService;