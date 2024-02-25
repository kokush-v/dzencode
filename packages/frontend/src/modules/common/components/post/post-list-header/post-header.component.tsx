import React from 'react';
import { useQueryClient } from 'react-query';
import { isMobile } from 'react-device-detect';

import { PostFilter } from '../post-filters';
import { PostSearch } from '../post-search';
import { PostHeaderStyled } from './post-header.styled';
import { PostFilterEnum } from '../post.enums';
import { QUERY_KEYS } from '../../../consts/app-keys.const';
import { selectPostFilter } from '../post.selectors';
import { PostFilters } from '../../../types/todo/post.types';
import { debounce } from '../../../utils';

export interface PostTableHeaderProps {
  variant: string;
}

export const PostTableHeader = ({ variant }: PostTableHeaderProps) => {
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

      <PostSearch
        onChange={debounce((event) => {
          const { value } = event.target as HTMLInputElement;

          queryClient.setQueriesData(QUERY_KEYS.FILTER, {
            ...filter,
            search: value,
            page: 1
          });
        }, 500)}
        width={isMobile ? '100%' : 'fit-content'}
        size="md"
        variant={variant}
      />
    </PostHeaderStyled>
  );
};
