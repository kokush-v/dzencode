import React from 'react';
import { Button, HStack, Heading, Skeleton } from '@chakra-ui/react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { QUERY_KEYS, ROUTER_KEYS, STORAGE_KEYS } from '../../../consts/app-keys.const';
import { UserHeaderStyled } from './user-header.styled';
import authService from '../../auth/auth.service';

export const UserHeader = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: () => authService.getUser(),
    refetchOnMount: true
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  /* eslint-disable */

  return (
    <UserHeaderStyled user={user}>
      {isLoading ? (
        <Skeleton width={'100%'}>
          <h1>SKELETON</h1>
        </Skeleton>
      ) : user ? (
        <HStack justifyContent={'space-between'} w={'100%'} padding={'0 1em'}>
          <Heading as="h1">{user.name}</Heading>
          <HStack>
            <Button
              colorScheme="red"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                queryClient.setQueriesData(QUERY_KEYS.USER, null);
              }}
            >
              LOG OUT
            </Button>
          </HStack>
        </HStack>
      ) : (
        <HStack>
          <Button colorScheme="green" onClick={() => navigate(ROUTER_KEYS.AUTH.LOGIN)}>
            LOGIN
          </Button>
          <Button
            colorScheme="green"
            variant={'outline'}
            onClick={() => navigate(ROUTER_KEYS.AUTH.SIGN_UP)}
          >
            SIGN UP
          </Button>
        </HStack>
      )}
    </UserHeaderStyled>
  );
};
