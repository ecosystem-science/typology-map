/**
 *
 * TypologyImage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Image } from 'grommet';
import styled, { css } from 'styled-components';
import { injectIntl } from 'react-intl';
import { Expand, Contract } from 'components/Icons';

import LoadingIndicator from 'components/LoadingIndicator';
import ImageInfo from 'components/ImageInfo';
import MapControl from 'components/MapControl';
import { PATHS, DIAGRAM_NAME_ENDING } from 'config';
import { DEFAULT_LOCALE } from 'i18n';

import messages from './messages';

const ImageWrap = styled(Box)`
  position: relative;
  width: 100%;
  margin-top: ${({ theme }) => theme.global.edgeSize.medium};
  margin-bottom: ${({ theme }) => theme.global.edgeSize.large};
  ${({ isFS }) =>
    isFS &&
    css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      text-align: center;
    `}
`;

const StyledImage = styled(Image)`
  max-width: 100%;
`;

const LoadingWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`;

const FSControlContainer = styled(props => <Box gap="small" {...props} />)`
  position: absolute;
  right: ${({ theme }) => theme.global.edgeSize.xsmall};
  top: ${({ theme }) => theme.global.edgeSize.xsmall};
`;
const FSControl = styled(MapControl)`
  border-radius: 9999px;
  padding: ${({ theme }) => theme.global.edgeSize.small};
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 1;
  &:hover {
    background: ${({ theme }) => theme.global.colors['light-grey']};
  }
`;

function GroupDiagram({ group, intl, fullscreen, onFullscreen }) {
  const { locale } = intl;
  const image = group.diagram;
  const [imageExists, setImageExists] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const src = `${PATHS.IMAGES}/${
    image && image.name ? image.name : `${group.path}${DIAGRAM_NAME_ENDING}`
  }`;
  // prettier-ignore
  return !imageExists ? null : (
    <ImageWrap flex={!fullscreen} isFS={fullscreen}>
      {!loaded && (
        <LoadingWrap>
          <LoadingIndicator />
        </LoadingWrap>
      )}
      <Box as="figure">
        <StyledImage
          src={`${src}`}
          onError={() => setImageExists(false)}
          onLoad={() => setLoaded(true)}
          fit="contain"
        />
        <ImageInfo
          below={!fullscreen}
          caption={
            image &&
            image.caption &&
            image.caption[locale] &&
            image.caption[locale].trim() !== ''
              ? image.caption[locale]
              : intl.formatMessage(messages.caption, {
                title: `${group.id} ${group.title[locale] || group.title[DEFAULT_LOCALE]}`,
              })
          }
        />
      </Box>
      {onFullscreen && (
        <FSControlContainer>
          <FSControl
            icon={
              fullscreen ? (
                <Contract color="black" />
              ) : (
                <Expand color="black" />
              )
            }
            onClick={() => onFullscreen()}
          />
        </FSControlContainer>
      )}
    </ImageWrap>
  );
}

GroupDiagram.propTypes = {
  group: PropTypes.object,
  fullscreen: PropTypes.bool,
  onFullscreen: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(GroupDiagram);
