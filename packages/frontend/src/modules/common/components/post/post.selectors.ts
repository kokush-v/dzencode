import { useMemo } from 'react';

import { InfiniteData, useQuery } from 'react-query';
import { QUERY_KEYS } from '../../consts/app-keys.const';
import { PostFilters } from '../../types/post/post.types';
import PostModel from '../../types/post/post.model';

export const selectPosts = () => {
  const { data } = useQuery<InfiniteData<PostModel[]>>({
    queryKey: [QUERY_KEYS.POSTS],
    select: (state) => state
  });

  return data;
};

export const selectPostFilter = () => {
  const { data } = useQuery<PostFilters>({
    queryKey: [QUERY_KEYS.SORT],
    select: (state) => state
  });

  return data;
};

export const useFormattedPosts = (posts: InfiniteData<PostModel[]> | undefined) => {
  const formattedPosts = useMemo(() => {
    if (!posts) {
      return [];
    }

    return posts.pages.flatMap((page) => page.map((todo) => todo));
  }, [posts]);

  return formattedPosts;
};
