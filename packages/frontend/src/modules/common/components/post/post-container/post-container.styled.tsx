import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import { COLORS, FONTS } from '../../../../theme';

export const PostContainerStyled = styled('div')`
  width: ${isMobile ? '100%' : '70%'};
  margin: auto;
  border: 1px solid ${COLORS.gray};
  display: flex;
  flex-direction: column;
  padding: 0.5em 0;
`;

export const StyledTitle = styled.div`
  font-size: ${FONTS.SIZES.l};
  text-weight: ${FONTS.WEIGHTS.bold};
  border-bottom: 1px solid ${COLORS.gray};
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
`;

export const StyledPostTableContainer = styled.div`
  padding: 0.5em;
`;

export const StyledPostMobileContainer = styled.div`
  disply: flex;
  flex-direction: col;
  align-items: center;
`;
