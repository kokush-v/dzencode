import React, { useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { Card, CardBody, CardProps, Divider, HStack, Text, VStack } from '@chakra-ui/react';

import { IPost } from '../../../types/todo/post.types';
import { PostTextStyled } from './post.styled';
import LightBoxImage from '../../ui/lightbox';
import { GoReply } from 'react-icons/go';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { generateRandomColor } from '../../../utils';

interface PostProps extends CardProps {
  post: IPost;
  baseMg: number;
  modalOnOpen: (replyParent: IPost) => void;
}

export const Post = ({ post, baseMg, modalOnOpen, ...props }: PostProps) => {
  const sanitizedHtml = sanitizeHtml(post.text, {
    allowedTags: ['strong', 'em', 'u', 'a', 'code', 'br'],
    allowedAttributes: {
      a: ['href']
    }
  });
  const color = generateRandomColor();
  const [showNested, setShowNested] = useState(false);

  return (
    <VStack width={'100%'}>
      <Card
        {...props}
        backgroundColor={'#fafafa'}
        cursor={'pointer'}
        width={'100%'}
        height={'auto'}
      >
        <CardBody
          onClick={() => {
            setShowNested(showNested ? false : true);
          }}
          width={'100%'}
        >
          <HStack padding={'0 .8em'} justifyContent={'space-between'}>
            <HStack>
              <Text>{post.userName}</Text>
              <Text fontSize={'.7em'}>{post.userEmail}</Text>
            </HStack>
            <HStack>
              <Text>{new Date(post.createdAt).toDateString()}</Text>
              <Divider orientation="vertical" height={'1em'} />
              <GoReply onClick={() => modalOnOpen(post)} />
            </HStack>
          </HStack>
          <Divider margin={'.4em 0'} />
          <PostTextStyled>
            <Text
              height={'auto'}
              display={'block'}
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              padding={'0 .4em'}
            />
            {post.file && (
              <div style={{ width: 'fit-content' }}>
                <LightBoxImage fileUrl={post.file} />
              </div>
            )}
          </PostTextStyled>
          {!showNested && post.replies && post.replies.length !== 0 && (
            <>
              <Divider margin={'.5em 0'} />
              <Text textAlign={'center'}>
                <ChevronDownIcon />
                Show {post.replies.length} collapsed
              </Text>
            </>
          )}
        </CardBody>
      </Card>
      {showNested &&
        post.replies &&
        post.replies.map((reply) => {
          let margin = baseMg;

          if (post.id !== reply.id) {
            margin = margin + 20;
          }

          return (
            <Post
              borderLeft={`3px solid ${color}`}
              modalOnOpen={modalOnOpen}
              baseMg={margin}
              key={reply.id}
              post={reply}
              style={{ marginLeft: `${margin}px` }}
            />
          );
        })}
    </VStack>
  );
};
