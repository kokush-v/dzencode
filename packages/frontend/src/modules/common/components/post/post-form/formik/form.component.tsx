import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import {
  VStack,
  FormControl,
  Button,
  Box,
  FormErrorMessage,
  AlertIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Fade,
  useToast
} from '@chakra-ui/react';
import { InfiniteData, useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { Editor } from 'primereact/editor';

import { PostSchema } from './validation.schema';
import todoService from '../../post.service';
import { QUERY_KEYS } from '../../../../consts/app-keys.const';
import { showErrorToast, showErrorToastWithText } from '../../../form.toasts';
import { IPostForm } from '../../../../types/todo/post.types';
import PostModel from '../../../../types/todo/post.model';

export interface FormikFormProps {}

export const FormikForm = () => {
  const { mutate: createPostMutation } = useMutation((formPayload: IPostForm) =>
    todoService.createPost(formPayload)
  );

  const queryClient = useQueryClient();
  const toast = useToast();

  const { isOpen: isVisibleSuccess, onOpen: successOnOpen } = useDisclosure();

  const formik = useFormik<IPostForm>({
    initialValues: {
      text: ''
    },
    validationSchema: PostSchema,
    onSubmit: (values) =>
      createPostMutation(values, {
        onSuccess: (post) => {
          successOnOpen();

          queryClient.setQueryData(
            [QUERY_KEYS.POSTS],
            (prev: InfiniteData<PostModel[]> | undefined) => {
              if (!prev) return { pageParams: [], pages: [[]] };

              console.log(prev);

              const lastPage = prev.pages[prev.pages.length - 1];

              if (lastPage && lastPage.length < 25) {
                return {
                  pages: [...prev.pages.slice(0, -1), [...lastPage, post]],
                  pageParams: prev.pageParams
                };
              } else {
                return {
                  pages: [...prev.pages, [post]],
                  pageParams: [...prev.pageParams, prev.pageParams.length + 1]
                };
              }
            }
          );
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            const msg = error.response?.status === 401 ? 'UNAUTHORIZED' : error.message;
            showErrorToastWithText(toast, msg);
          } else {
            showErrorToast(toast);
          }
        }
      })
  });

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-link" aria-label="Link"></button>
        <button className="ql-code" aria-label="Code"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div>
      <Box bg="white" rounded="md">
        {!isVisibleSuccess ? (
          <Fade in={!isVisibleSuccess}>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="center">
                <FormControl
                  height={'320px'}
                  isInvalid={formik.touched.text && !!formik.errors.text}
                >
                  <Editor
                    id="text"
                    name="text"
                    value={formik.values.text}
                    onTextChange={(e) => {
                      formik.setFieldValue('text', e.textValue);
                    }}
                    headerTemplate={header}
                    style={{ height: '240px' }}
                  />
                  {formik.touched.text && <FormErrorMessage>Text is required.</FormErrorMessage>}
                </FormControl>
                <Button type="submit" colorScheme="purple" width="full">
                  Create post
                </Button>
              </VStack>
            </form>
          </Fade>
        ) : (
          <Fade in={isVisibleSuccess}>
            <Alert
              borderRadius=".5em"
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              minHeight="250px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                POST submitted!
              </AlertTitle>
              <AlertDescription maxWidth="sm">Thanks for submitting your todo.</AlertDescription>
            </Alert>
          </Fade>
        )}
      </Box>
    </div>
  );
};
