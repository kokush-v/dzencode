import React from 'react';
import { useQueryClient } from 'react-query';
import { isMobile } from 'react-device-detect';

import { PostFilter } from '../post-filters';
import { PostHeaderStyled } from './post-header.styled';
import { PostFilterEnum } from '../post.enums';
import { QUERY_KEYS } from '../../../consts/app-keys.const';
import { selectPostFilter } from '../post.selectors';
import { PostFilters } from '../../../types/post/post.types';

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
          const tab =
            Object.values(PostFilterEnum)[index] === 'All'
              ? ''
              : Object.values(PostFilterEnum)[index];

          queryClient.setQueriesData(QUERY_KEYS.FILTER, {
            ...filter,
            filter: tab.toLocaleLowerCase(),
            page: 1
          });
        }}
        width="100%"
        justifyContent={isMobile ? 'space-around' : 'flex-start'}
        size="md"
        variant={isMobile ? 'line' : 'enclosed'}
      />
    </PostHeaderStyled>
  );
};
