import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Drop, Box, Text } from 'grommet';

import LocaleToggle from 'containers/LocaleToggle';

import Secondary from './Secondary';
import ArrowIcon from './ArrowIcon';

const DropMenuWrapper = styled(p => (
  <Box flex={{ shrink: 0 }} responsive={false} {...p} />
))`
  min-width: 200px;
`;

const LocaleTitle = styled(p => <Text {...p} />)`
  color: ${({ theme }) => theme.global.colors.white};
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.text.xxsmall.size};
  line-height: ${({ theme }) => theme.text.xxsmall.height};
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    font-size: ${({ theme }) => theme.text.medium.size};
    line-height: ${({ theme }) => theme.text.medium.height};
  }
`;

// prettier-ignore
const MenuButton = styled(
  React.forwardRef((props, ref) => (
    <Secondary plain ref={ref} {...props} fill="vertical" />
  ))
)``;

const DropMenuLocale = ({ locale }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const targetRef = useRef();
  return (
    <>
      <MenuButton
        open={open}
        onClick={() => setOpen(!open)}
        ref={targetRef}
      >
        <Box direction="row" align="center" gap="small">
          <LocaleTitle>{locale}</LocaleTitle>
          <ArrowIcon open={open} />
        </Box>
      </MenuButton>
      {open && targetRef.current && (
        <Drop
          target={targetRef.current}
          align={{ top: 'bottom', right: 'right' }}
          onClickOutside={handleClose}
          onEsc={handleClose}
        >
          <DropMenuWrapper>
            <LocaleToggle />
          </DropMenuWrapper>
        </Drop>
      )}
    </>
  );
};

DropMenuLocale.propTypes = {
  locale: PropTypes.string,
};

export default DropMenuLocale;
