import React from 'react';
import styled from 'styled-components';
import { Header } from 'grommet';
import { getHeaderHeight } from 'utils/responsive';

export default styled(props => (
  <Header align="start" gap="none" elevation="medium" {...props} />
))`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.dimensions.header.zIndex};
  background: ${({ theme }) => theme.global.colors.header.background};
  /* responsive height */
  height: ${getHeaderHeight('small')}px;
  padding-left: ${({ theme }) => theme.global.edgeSize.hair};
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    padding-left: ${({ theme }) => theme.global.edgeSize.xsmall};
    height: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    padding-left: ${({ theme }) => theme.global.edgeSize.medium};
    height: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    height: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    height: ${getHeaderHeight('xlarge')}px;
  }
`;
