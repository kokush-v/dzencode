import React from 'react';
import { IPost } from '../../../types/post/post.types';
import { Post } from '../post-elem';
import { VStack } from '@chakra-ui/react';

interface PostListProps {
  posts: IPost[];
  modalOnOpen: (replyParent: IPost) => void;
}

export const PostList = ({ posts, modalOnOpen }: PostListProps) => {
  const baseMg = 20;

  return (
    <VStack margin={'.5em 0'} width={'100%'} gap={5}>
      {posts.map((post, key) => {
        return <Post modalOnOpen={modalOnOpen} baseMg={baseMg} key={key} post={post} />;
      })}
    </VStack>
  );
};
