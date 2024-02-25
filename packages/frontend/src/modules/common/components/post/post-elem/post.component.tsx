import React, { useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import {
  Card,
  CardBody,
  CardProps,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react';

import { IPost } from '../../../types/post/post.types';
import { PostTextStyled } from './post.styled';
import LightBoxImage from '../../ui/lightbox';
import { GoFile, GoReply } from 'react-icons/go';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { generateRandomColor, getFileUrlType } from '../../../utils';
import { Editor } from 'primereact/editor';
import axios from 'axios';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fileTxtValue, setFileTxtValue] = useState('');

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
            {post.file &&
              (getFileUrlType(post.file) === 'txt' ? (
                <>
                  <HStack
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen();
                      if (getFileUrlType(post.file) === 'txt' && post.file) {
                        axios
                          .get(post.file)
                          .then(({ data }) => setFileTxtValue(data))
                          .catch((err) => console.log(err));
                      }
                    }}
                    justifyContent={'center'}
                  >
                    <Icon as={GoFile} />
                    <Text>Open file</Text>
                  </HStack>
                  <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader></ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Editor
                          readOnly
                          id="text"
                          name="text"
                          value={fileTxtValue}
                          headerTemplate={
                            <span className="ql-formats">
                              <button className="ql-code" aria-label="Code"></button>
                            </span>
                          }
                          style={{ minHeight: '240px' }}
                        />
                      </ModalBody>
                      <ModalFooter />
                    </ModalContent>
                  </Modal>
                </>
              ) : (
                <div style={{ width: 'fit-content' }}>
                  <LightBoxImage fileUrl={post.file} />
                </div>
              ))}
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
