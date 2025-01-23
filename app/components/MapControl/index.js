import React from 'react';
import styled from 'styled-components';
import { Button } from 'grommet';

// prettier-ignore
export default styled(props => <Button plain {...props} />)`
  border-radius: ${({ square }) => (square ? 0 : 9999)}px;
  padding: ${({ theme }) => theme.global.edgeSize.small};
  background: ${({ active, theme }) =>
    active ? theme.global.colors.brand : 'rgba(255, 255, 255, 0.85)'};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 1;
  &:hover {
    background: ${({ active, theme }) =>
    active ? theme.global.colors.brand : 'white'};
  }
`;
