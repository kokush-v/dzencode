import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

export const PostHeaderStyled = styled.div`
  display: flex;
  justify-content: space-around;
  ${isMobile && 'flex-direction: column-reverse;'}
`;
