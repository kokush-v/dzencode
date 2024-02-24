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
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (key !== 'parent') formData.append(key, value);
    });

    const { data } = await this.put<IPost>({
      method: 'post',
      url: BACKEND_KEYS.POSTS.CREATE,
      data: formData
    });

    return data;
  }

  async replyPost(body: IPostForm) {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (key !== 'parent') formData.append(key, value);
    });

    if (!body.parent) throw new Error('No reply parent');

    const { data } = await this.put<IPost>({
      method: 'post',
      url: BACKEND_KEYS.POSTS.REPLY(body.parent),
      data: formData
    });

    return data;
  }
}

export default new PostService();
