import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Drop, Box, Text } from 'grommet';
import styled from 'styled-components';

import { Menu } from 'components/Icons';

import DropContentMobile from './DropContentMobile';
import Secondary from './Secondary';

const MenuIcon = styled(Menu)`
  transform: ${({ open }) => (open ? 'rotate(90deg)' : 'none')};
`;

// prettier-ignore
const MenuButton = styled(
  React.forwardRef((props, ref) => (
    <Secondary plain ref={ref} {...props} fill="vertical" />
  ))
)``;

const DropMenuMobile = ({
  active = false,
  label,
  navGroups,
  onNavPage,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const targetRef = useRef();

  return (
    <>
      <MenuButton
        active={active}
        open={open}
        onClick={() => setOpen(!open)}
        ref={targetRef}
      >
        <Box>
          <MenuIcon open={open} />
        </Box>
      </MenuButton>
      {open && targetRef.current && (
        <Drop
          target={targetRef.current}
          align={{ top: 'bottom', left: 'left' }}
          onClickOutside={handleClose}
          onEsc={handleClose}
        >
          <DropContentMobile
            navGroups={navGroups}
            onSelectItem={path => {
              onNavPage(path);
              handleClose();
            }}
          />
        </Drop>
      )}
    </>
  );
};

DropMenuMobile.propTypes = {
  label: PropTypes.string,
  navGroups: PropTypes.object,
  onNavPage: PropTypes.func,
};

export default DropMenuMobile;
