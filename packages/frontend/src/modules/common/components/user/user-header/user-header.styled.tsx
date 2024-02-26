import styled from 'styled-components';
import React from 'react';

import { IUser } from '../../../types/user/user.types';

interface UserHeaderStyledProps {
  user: IUser | undefined;
  children: React.ReactNode;
}

export const UserHeaderStyled = styled('div')<UserHeaderStyledProps>`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ user }) => (user ? 'space-around' : 'end')};
  margin-bottom: 0.5em;
`;
