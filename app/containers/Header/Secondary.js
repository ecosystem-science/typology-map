import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';

// prettier-ignore
const Secondary = styled(React.forwardRef((props, ref) => (
  <Button plain ref={ref} {...props} fill="vertical" />
)))`
  padding-top: ${({ theme }) => theme.global.edgeSize.small};
  padding-bottom: ${({ theme }) => theme.global.edgeSize.small};
  padding-left: ${({ theme }) => theme.global.edgeSize.xsmall};
  padding-right: ${({ theme }) => theme.global.edgeSize.xsmall};
  color: ${({ theme }) => theme.global.colors.white};
  background: ${({ active, open, theme }) => ((active || open) ? theme.global.colors.brand : 'transparent')};
  &:focus-visible,
  &:hover {
    background: ${({ theme }) => theme.global.colors.hover};
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    padding: 0 ${({ theme }) => theme.global.edgeSize.ms};
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    padding: 0 ${({ theme }) => theme.global.edgeSize.medium};
  }
`;

export default Secondary;
