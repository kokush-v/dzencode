import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import {
  VStack,
  FormControl,
  Input,
  Button,
  Box,
  FormErrorMessage,
  useToast,
  Flex,
  FormLabel,
  Heading,
  HStack
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

import { AuthData } from '../../../types/auth/auth.types';
import { authSchema } from './validation.schema';
import { QUERY_KEYS, ROUTER_KEYS } from '../../../consts/app-keys.const';
import authService from '../auth.service';
import { selectUser } from '../../user/user.selector';
import { showErrorToast, showErrorToastWithText, showSuccesToast } from '../../form.toasts';

/* eslint-disable */

export interface FormikAuthFormProps {
  type: 'register' | 'login';
}

export const FormikAuthForm = ({ type }: FormikAuthFormProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => authService.getUser()
  });

  const user = selectUser();

  const { mutate: loginMutation } = useMutation((formPayload: AuthData) =>
    authService.login(formPayload)
  );

  const { mutate: regMutation } = useMutation((formPayload: AuthData) =>
    authService.register(formPayload)
  );

  const sumbitFunc = {
    login: ({ name, ...values }: AuthData) =>
      loginMutation(values, {
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEYS.USER);
          navigate(ROUTER_KEYS.HOME);
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            console.log(error);
            showErrorToastWithText(toast, error.response?.data.error);
          } else {
            showErrorToast(toast);
          }
        }
      }),

    register: (values: AuthData) =>
      regMutation(values, {
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEYS.USER);
          showSuccesToast(toast, 'Account was created');
          navigate(ROUTER_KEYS.AUTH.LOGIN);
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            showErrorToastWithText(toast, error.response?.data.error);
          } else {
            showErrorToast(toast);
          }
        }
      })
  };

  const formik = useFormik<AuthData>({
    initialValues: { email: '', password: '', name: '' },
    validationSchema: authSchema,
    onSubmit: sumbitFunc[type as keyof typeof sumbitFunc]
  });

  useEffect(() => {
    if (user) navigate(ROUTER_KEYS.HOME);
  }, [user]);

  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md" w={'25%'}>
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="flex-start">
            <Heading size={'md'} color="purple" textTransform={'uppercase'}>
              {type === 'login' ? 'sign in' : 'sign up'}
            </Heading>
            <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            {type === 'register' && (
              <FormControl isInvalid={!!formik.errors.name && formik.touched.name}>
                <FormLabel htmlFor="password">Name</FormLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>
            )}
            <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <HStack justifyContent={'space-between'} width={'100%'}>
              <Link
                className="text-sm text-gray-400 "
                to={type === 'login' ? ROUTER_KEYS.AUTH.SIGN_UP : ROUTER_KEYS.AUTH.LOGIN}
              >
                {type === 'login' ? 'Create account' : 'Login'}
              </Link>
            </HStack>
            <Button type="submit" colorScheme="purple" width="fit-content" alignSelf={'center'}>
              {type === 'login' ? 'Login' : 'Create account'}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};
