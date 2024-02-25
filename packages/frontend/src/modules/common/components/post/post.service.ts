import HttpService from '../../../api/http.service';
import { BACKEND_KEYS } from '../../consts/app-keys.const';
import { createPostModel } from '../../types/todo/post.model';
import { IPost, IPostForm, PostFilters } from '../../types/todo/post.types';

class PostService extends HttpService {
  async getPosts(filter: Omit<PostFilters, 'maxPages'> | undefined, page: number) {
    const { data, pages = 1 } = await this.get<IPost[]>({
      url: BACKEND_KEYS.POSTS.ROOT,
      params: { ...filter, page }
    });

    return { data: data.map((todo) => createPostModel(todo)), pages };
  }

  async createPost(body: IPostForm) {
    const { data } = await this.put<IPost>({
      method: 'post',
      url: BACKEND_KEYS.POSTS.CREATE,
      data: body
    });

    return data;
  }
}

export default new PostService();
