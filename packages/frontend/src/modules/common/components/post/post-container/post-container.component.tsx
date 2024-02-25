import React, { useEffect, useState } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { BrowserView } from 'react-device-detect';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { PostTableHeader } from '../post-list-header';
import {
  StyledTitle,
  StyledPostTableContainer,
  PostContainerStyled
} from './post-container.styled';
import { FormModal } from '../post-form/form-modal';
import { QUERY_KEYS, ROUTER_KEYS } from '../../../consts/app-keys.const';
import postService from '../post.service';
import { selectUser } from '../../user/user.selector';
import { IPost, PostFilters } from '../../../types/todo/post.types';
import { LoadMore } from '../load-more';
import PostModel from '../../../types/todo/post.model';
import { useFormattedPosts } from '../post.selectors';
import { buildQueryString } from '../../../utils';
import { PostList } from '../post-list';

/* eslint-disable */

export const PostContainer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = selectUser();
  const [replyParent, setReplyParent] = useState<IPost>();
  const [formType, setFormType] = useState<'NEW' | 'REPLY'>('NEW');

  const searchParams = new URLSearchParams(window.location.search);

  const { data: params } = useQuery<PostFilters>({
    queryKey: [QUERY_KEYS.FILTER],
    initialData: {
      filter: (searchParams.get('filter') as '') || '',
      search: searchParams.get('search') || '',
      page: Number(searchParams.get('page')) || 1,
      maxPages: 1
    },
    queryFn: async () => ({
      filter: (searchParams.get('filter') as '') || '',
      search: searchParams.get('search') || '',
      page: Number(searchParams.get('page')) || 1,
      maxPages: 1
    }),
    onSuccess: (data) => {
      const newUrl = buildQueryString(data);
      window.history.replaceState(null, '', `${window.location.pathname}?${newUrl}`);
    }
  });

  const {
    data: posts,
    fetchNextPage,
    isError,
    isLoading,
    refetch
  } = useInfiniteQuery<PostModel[]>(
    [QUERY_KEYS.POSTS],
    async ({ pageParam = 1 }) => {
      const response = await postService.getPosts(params, pageParam);

      const updatedParams = {
        ...params,
        maxPages: response?.pages
      };

      queryClient.setQueryData([QUERY_KEYS.FILTER], updatedParams);

      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 25 ? allPages.length + 1 : undefined;
      }
    }
  );

  const fetchMore = async () => {
    fetchNextPage().then(({ data }) => {
      const nextPage =
        (params?.page ?? 0) > (params?.maxPages ?? 0)
          ? params?.maxPages ?? 0
          : (params?.page ?? 1) + 1;

      const updatedParams = {
        ...params,
        page: nextPage,
        maxPages: data?.pageParams[data.pageParams.length - 1] || params?.maxPages
      };

      queryClient.setQueryData([QUERY_KEYS.FILTER], updatedParams);
    });
  };

  const formatPosts = useFormattedPosts(posts);

  useEffect(() => {
    refetch();
  }, [params]);

  const modalOnOpen = (postParent: IPost) => {
    setReplyParent(postParent);
    setFormType('REPLY');
    onOpen();
  };

  return (
    <PostContainerStyled>
      <StyledTitle>
        <h1>POSTS List</h1>
        <Button
          onClick={() => {
            setFormType('NEW');
            user ? onOpen() : navigate(ROUTER_KEYS.AUTH.LOGIN);
          }}
          colorScheme="purple"
          variant="outline"
          leftIcon={<AddIcon boxSize={3} />}
        >
          NEW POST
        </Button>
        <FormModal
          formType={formType}
          isOpen={isOpen}
          onClose={onClose}
          initialData={replyParent}
        />
      </StyledTitle>

      <BrowserView>
        <StyledPostTableContainer>
          <PostTableHeader variant="enclosed" />
          <PostList modalOnOpen={modalOnOpen} posts={formatPosts} />
        </StyledPostTableContainer>
      </BrowserView>

      <LoadMore
        isDisabled={!!params?.maxPages && params?.page ? params.page === params.maxPages : false}
        colorScheme="teal"
        variant={'outline'}
        alignSelf={'center'}
        onClick={fetchMore}
      />
    </PostContainerStyled>
  );
};
