import PostService from '../services/post.service';

export class PostController {
  #postService: PostService;
  constructor() {
    this.#postService = new PostService();
  }

  async createPost() {
    return;
  }

  async getPost() {
    return;
  }
}

const postController = new PostController();

export default postController;
