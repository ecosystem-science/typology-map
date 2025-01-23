/**
 *
 * PageBackground
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image } from 'grommet';

import ImageInfo from 'components/ImageInfo';

import { getHeaderHeight, getAsideWidth } from 'utils/responsive';
const Styled = styled.div`
  background: ${({ theme }) => theme.global.colors.black};
  position: fixed;
  left: 0;
  bottom: 0;
  overflow: hidden;
  /* responsive height */
  top: ${getHeaderHeight('small')}px;
  right: ${getAsideWidth('small')}px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    top: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    top: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    top: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    top: ${getHeaderHeight('xxlarge')}px;
  }
`;

function PageBackground({ image }) {
  return (
    <Styled>
      {image.src && (
        <Image fill fit="cover" src={image.src} alignSelf="start" />
      )}
      {(image.credit || image.caption) && (
        <ImageInfo caption={image.caption} credit={image.credit} />
      )}
    </Styled>
  );
}

PageBackground.propTypes = {
  image: PropTypes.object,
};

export default PageBackground;
