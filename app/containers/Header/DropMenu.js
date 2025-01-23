import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Drop, Box, Text } from 'grommet';
import styled from 'styled-components';

import DropContentGeneric from './DropContentGeneric';
import Secondary from './Secondary';
import ArrowIcon from './ArrowIcon';

const SecondaryLabel = styled(p => <Text {...p} size="medium" />)`
  color: ${({ theme }) => theme.global.colors.white};
`;

// prettier-ignore
const MenuButton = styled(
  React.forwardRef((props, ref) => (
    <Secondary plain ref={ref} {...props} fill="vertical" />
  ))
)``;

const DropMenu = ({
  active = false,
  label,
  dropPages,
  onNavPage,
  activePageId,
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
        <Box direction="row" align="center" gap="small">
          <SecondaryLabel>{label}</SecondaryLabel>
          <ArrowIcon open={open} />
        </Box>
      </MenuButton>
      {open && targetRef.current && (
        <Drop
          target={targetRef.current}
          align={{ top: 'bottom', left: 'left' }}
          onClickOutside={handleClose}
          onEsc={handleClose}
        >
          <DropContentGeneric
            handleClose={handleClose}
            pages={dropPages}
            onSelectItem={onNavPage}
            activePageId={activePageId}
          />
        </Drop>
      )}
    </>
  );
};

DropMenu.propTypes = {
  label: PropTypes.string,
  dropPages: PropTypes.array,
  onNavPage: PropTypes.func,
  activePageId: PropTypes.string,
};

export default DropMenu;
