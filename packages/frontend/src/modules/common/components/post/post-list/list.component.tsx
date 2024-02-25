import React from 'react';
import { IPost } from '../../../types/todo/post.types';
import { Post } from '../post-elem';
import { VStack } from '@chakra-ui/react';

interface PostListProps {
  posts: IPost[];
}

export const PostList = ({ posts }: PostListProps) => {
  return (
    <VStack margin={'.5em 0'} width={'100%'} gap={5}>
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </VStack>
  );
};
