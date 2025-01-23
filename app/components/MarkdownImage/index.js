/**
 *
 * TypologyImage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Box } from 'grommet';
import styled from 'styled-components';

const ImageWrap = styled(props => (
  <Box as="span" margin={{ vertical: 'medium' }} {...props} />
))`
  display: block;
  position: relative;
  width: 100%;
`;

const Styled = styled(Box)`
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.8;
`;

const Caption = styled.span`
  display: block;
  background: rgba(0, 0, 0, 0.6);
  color: white !important;
  padding: 0px 5px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  text-align: right;
`;

function MarkdownImage({ image }) {
  const [imageExists, setImageExists] = useState(true);
  const { src, caption } = image;
  const captionIdRef = React.useRef(`caption-${Math.random().toString(36).substr(2, 9)}`);

  return !imageExists ? null : (
    <ImageWrap role="group">
      <Image
        fill
        fit="cover"
        src={src}
        onError={() => setImageExists(false)}
        alignSelf="center"
        aria-labelledby={captionIdRef.current}
        alt=""
      />
      {caption && (
        <Styled id={captionIdRef.current} as="span" align="end" role="caption">
          <Caption>{caption}</Caption>
        </Styled>
      )}
    </ImageWrap>
  );
}

MarkdownImage.propTypes = {
  image: PropTypes.object,
};

export default MarkdownImage;
