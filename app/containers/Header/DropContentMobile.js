import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Box, Button, Text, Layer, ResponsiveContext } from 'grommet';

import { getHeaderHeight } from 'utils/responsive';

import Img from 'components/Img';

import commonMessages from 'messages';

const IconImg = styled(Img)`
  vertical-align: middle;
  max-height: 100%;
  filter: invert(100%);
  height: 22px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    height: 30px;
  }
`;
// prettier-ignore
const NavGroupTitleWrapper = styled(p => <Box {...p} />)`
  color: ${({ theme }) => theme.global.colors['dark-grey']};
  padding:
    ${({ theme }) => theme.global.edgeSize.small}
    ${({ theme }) => theme.global.edgeSize.medium};
  padding-bottom: 0;
`;
// prettier-ignore
const NavGroup = styled(p => <Box {...p} />)`
  border-bottom: 1px solid
    ${({ theme, last }) =>
    last ? 'transparent' : theme.global.colors['grey']};
`;
// prettier-ignore
const StyledButton = styled(props => <Button {...props} plain />)`
  padding:
    ${({ theme }) => theme.global.edgeSize.small}
    ${({ theme }) => theme.global.edgeSize.medium};
  color: ${({ theme }) => theme.global.colors['brand-2']};
  background: transparent;
  &:hover, &:focus {
    background: ${({ theme }) => theme.global.colors['hover-grey']};
  }
`;
const IconImgWrap = styled.div``;

const DropContentMobile = ({ navGroups, onSelectItem }) => {
  const size = React.useContext(ResponsiveContext);
  if (!navGroups) return null;
  return (
    <Layer
      full="horizontal"
      responsive={false}
      margin={{ top: `${getHeaderHeight(size)}px` }}
      modal={false}
      animate={false}
      position="top"
      style={{ zIndex: 1300, overflowX: 'auto' }}
      plain
    >
      <Box
        elevation="medium"
        style={{ borderTop: '1px solid white' }}
        pad={{ bottom: 'medium' }}
        flex={false}
        background="white"
      >
        {Object.entries(navGroups).map(([group, pages], index) => {
          if (!group) return null;
          return (
            <NavGroup
              direction="column"
              key={group}
              last={index === Object.keys(navGroups).length - 1}
            >
              <NavGroupTitleWrapper>
                <Text size="xsmall">
                  <FormattedMessage {...commonMessages[`navGroup_${group}`]} />
                </Text>
              </NavGroupTitleWrapper>
              {pages &&
                pages.map(p => (
                  <Box key={p.key}>
                    <StyledButton
                      onClick={() => onSelectItem(p.key)}
                      label={
                        <Box direction="row" justify="between" align="center">
                          <Text size="small">
                            <FormattedMessage
                              {...commonMessages[`page_${p.key}`]}
                            />
                          </Text>
                          {p.icon && (
                            <IconImgWrap>
                              <IconImg src={p.icon} alt="" />
                            </IconImgWrap>
                          )}
                        </Box>
                      }
                    />
                  </Box>
                ))}
            </NavGroup>
          );
        })}
      </Box>
    </Layer>
  );
};

DropContentMobile.propTypes = {
  navGroups: PropTypes.object,
  onSelectItem: PropTypes.func,
};

export default DropContentMobile;
