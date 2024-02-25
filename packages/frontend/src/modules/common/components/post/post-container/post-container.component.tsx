import React, { useEffect, useState } from 'react';
import { Button, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { BrowserView } from 'react-device-detect';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { PostHeader } from '../post-list-header';
import {
  StyledTitle,
  StyledPostTableContainer,
  PostContainerStyled
} from './post-container.styled';
import { FormModal } from '../post-form/form-modal';
import { QUERY_KEYS, ROUTER_KEYS } from '../../../consts/app-keys.const';
import postService from '../post.service';
import { selectUser } from '../../user/user.selector';
import { IPost, PostFilters } from '../../../types/post/post.types';
import { LoadMore } from '../load-more';
import PostModel from '../../../types/post/post.model';
import { useFormattedPosts } from '../post.selectors';
import { buildQueryString } from '../../../utils';
import { PostList } from '../post-list';
import { PostFilterEnum, PostOrderEnum } from '../post.enums';

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
    queryKey: [QUERY_KEYS.SORT],
    initialData: {
      sort: (searchParams.get('sort') as PostFilterEnum) || PostFilterEnum.DATE,
      order: (searchParams.get('order') as PostOrderEnum) || PostOrderEnum.ASC,
      page: Number(searchParams.get('page')) || 1,
      maxPages: 1
    },
    queryFn: async () => ({
      sort: (searchParams.get('sort') as PostFilterEnum) || PostFilterEnum.DATE,
      order: (searchParams.get('order') as PostOrderEnum) || PostOrderEnum.ASC,
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
    isFetching,
    refetch
  } = useInfiniteQuery<PostModel[]>(
    [QUERY_KEYS.POSTS],
    async () => {
      const response = await postService.getPosts(params);

      const updatedParams = {
        ...params,
        maxPages: response?.pages
      };

      queryClient.setQueryData([QUERY_KEYS.SORT], updatedParams);

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

      queryClient.setQueryData([QUERY_KEYS.SORT], updatedParams);
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
      {isLoading ||
        (isFetching && (
          <div
            style={{
              position: 'absolute',
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.54)',
              zIndex: '100',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Spinner size={'xl'} />
          </div>
        ))}

      {isError && <Text>Server error</Text>}
      {posts && (
        <BrowserView>
          <StyledPostTableContainer>
            <PostHeader />
            <PostList modalOnOpen={modalOnOpen} posts={formatPosts} />
          </StyledPostTableContainer>
        </BrowserView>
      )}

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
