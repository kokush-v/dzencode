import React from 'react';
import { IPost } from '../../../types/todo/post.types';
import { Card, CardBody, Divider, HStack, Text } from '@chakra-ui/react';

interface PostProps {
  post: IPost;
}

export const Post = ({ post }: PostProps) => {
  return (
    <Card backgroundColor={'#fafafa'} cursor={'pointer'} width={'100%'}>
      <CardBody width={'100%'}>
        <HStack padding={'0 .8em'} justifyContent={'space-between'}>
          <HStack>
            <Text>{post.userName}</Text>
            <Text fontSize={'.7em'}>{post.userEmail}</Text>
          </HStack>
          <Text>{new Date(post.createdAt).toDateString()}</Text>
        </HStack>
        <Divider margin={'.4em 0'} />
        <Text padding={'0 .4em'}>{post.text}</Text>
      </CardBody>
    </Card>
  );
};
