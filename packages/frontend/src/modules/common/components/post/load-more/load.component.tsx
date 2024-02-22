import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import { PlusSquareIcon } from '@chakra-ui/icons';

interface LoadMoreProps extends ButtonProps {}

export const LoadMore = ({ ...props }: LoadMoreProps) => (
  <Button {...props} leftIcon={<PlusSquareIcon />}>
    More
  </Button>
);
