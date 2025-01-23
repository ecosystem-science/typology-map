/**
 *
 * IconsRealm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import styled from 'styled-components';

import Img from 'components/Img';

import { ICONS } from 'config';

const StyledBox = styled(props => (
  <Box direction="row" align="center" {...props} wrap />
))`
  height: ${({ theme }) => theme.dimensions.realmIconsSmall.single + 20}px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    height: ${({ theme }) => theme.dimensions.realmIcons.single + 20}px;
  }
`;
// prettier-ignore
const IconImg = styled(Img)`
  width: ${({ theme, multiple }) =>
    theme.dimensions.realmIconsSmall[multiple ? 'multi' : 'single']}px;
  height: ${({ theme, multiple }) =>
    theme.dimensions.realmIconsSmall[multiple ? 'multi' : 'single']}px;
  margin: 0 -${({ count }) => {
    if (count === 2) return 8;
    if (count === 3) return 12;
    return 0;
  }}px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    width: ${({ theme, multiple }) =>
    theme.dimensions.realmIcons[multiple ? 'multi' : 'single']}px;
    height: ${({ theme, multiple }) =>
    theme.dimensions.realmIcons[multiple ? 'multi' : 'single']}px;
  }
`;

function IconRealm({ realmId, type }) {
  if (!ICONS[realmId]) return null;
  return (
    <StyledBox>
      {Object.values(ICONS[realmId]).map((icon, index) => (
        <IconImg
          src={icon}
          key={index}
          multiple={type === 'trans'}
          alt=""
          count={Object.keys(ICONS[realmId]).length}
        />
      ))}
    </StyledBox>
  );
}

IconRealm.propTypes = {
  realmId: PropTypes.string,
  type: PropTypes.string,
};

export default memo(IconRealm);
