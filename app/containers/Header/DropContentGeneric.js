import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Box, Button } from 'grommet';

import commonMessages from 'messages';

// prettier-ignore
const DropItem = styled(props => <Button {...props} plain />)`
  padding:
    ${({ theme }) => theme.global.edgeSize.small}
    ${({ theme }) => theme.global.edgeSize.medium};
  color: ${({ theme }) => theme.global.colors['brand-2']};
  background: ${({ active, theme }) => active ? theme.global.colors['light-grey'] : 'transparent'} ;
  &:hover, &:focus {
    background: ${({ theme }) => theme.global.colors['hover-grey']};
  }
`;

const DropMenuWrapper = styled(p => (
  <Box flex={{ shrink: 0 }} responsive={false} {...p} />
))`
  min-width: 200px;
`;

const DropContentGeneric = ({ handleClose, onSelectItem, pages, activePageId }) => (
  <DropMenuWrapper>
    {pages.map(p => (
      <DropItem
        key={p.key}
        active={activePageId === p.key}
        onClick={() => {
          onSelectItem(p.key);
          handleClose();
        }}
      >
        <FormattedMessage {...commonMessages[`page_${p.key}`]} />
      </DropItem>
    ))}
  </DropMenuWrapper>
);

DropContentGeneric.propTypes = {
  pages: PropTypes.array,
  onSelectItem: PropTypes.func,
  handleClose: PropTypes.func,
  activePageId: PropTypes.string,
};

export default DropContentGeneric;
