import React from 'react';
import { useQueryClient } from 'react-query';

import { PostFilter } from '../post-filters';
import { PostHeaderStyled } from './post-header.styled';
import { PostFilterEnum, PostOrderEnum } from '../post.enums';
import { QUERY_KEYS } from '../../../consts/app-keys.const';
import { selectPostFilter } from '../post.selectors';
import { PostFilters } from '../../../types/post/post.types';
import { PostOrder } from '../post-order';

export interface PostTableHeaderProps {
  variant: string;
}

export const PostHeader = () => {
  const queryClient = useQueryClient();
  const filter = selectPostFilter() as PostFilters;

  return (
    <PostHeaderStyled>
      <PostFilter
        onChange={(index) => {
          const tab = Object.values(PostFilterEnum)[index];

          queryClient.setQueriesData(QUERY_KEYS.SORT, {
            ...filter,
            sort: tab,
            page: 1
          });
        }}
        width="100%"
        justifyContent={'flex-start'}
        size="md"
        variant={'enclosed'}
      />
      <PostOrder
        onChange={(index) => {
          const tab = Object.values(PostOrderEnum)[index];

          queryClient.setQueriesData(QUERY_KEYS.SORT, {
            ...filter,
            order: tab,
            page: 1
          });
        }}
        width="100%"
        justifyContent={'flex-end'}
        size="md"
        variant={'enclosed'}
      />
    </PostHeaderStyled>
  );
};
