import React from 'react';
import { Button } from 'grommet';
import styled from 'styled-components';

export default styled(p => (
  <Button
    plain
    as="a"
    target="_blank"
    onClick={evt => {
      if (evt) evt.stopPropagation();
    }}
    {...p}
  />
))`
  font-size: ${({ theme }) => theme.text.xxsmall.size};
  line-height: ${({ theme }) => theme.text.xxsmall.height};
  color: ${({ theme }) => theme.global.colors.text.light};
  text-decoration: ${({ underline }) =>
    underline ? 'underline' : 'none'} !important;
  &:visited {
    color: ${({ theme }) => theme.global.colors.text.light};
  }
  &:hover {
    color: ${({ theme }) => theme.global.colors.brand};
  }
`;
