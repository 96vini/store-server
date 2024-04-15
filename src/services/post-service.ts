import { IPostRepository, Location } from '@/repositories/post-repository';
import HttpResponse from '@/utils/HttpResponse';

class PostService {
  readonly postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  async create(post) {
    const newPost = this.postRepository.create(post);
    return HttpResponse.created(newPost);
  }

  async findAllByLocation(location: Location) {
    const posts = await this.postRepository.findAllByLocation(location);
    return posts;
  }
}

export default PostService;
