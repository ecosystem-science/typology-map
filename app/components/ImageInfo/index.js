/**
 *
 * ImageInfo
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Box } from 'grommet';
import MarkdownWrapper from 'containers/MarkdownWrapper';

import commonMessages from 'messages';

const Styled = styled(Box)`
  position: ${({ below }) => (below ? 'relative' : 'absolute')};
  right: 0;
  bottom: 0;
  opacity: 0.8;
`;

const Caption = styled.div`
  background: rgba(0, 0, 0, 0.6);
  color: white !important;
  padding: 0px 5px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  text-align: right;
`;

const Credit = styled(Caption)`
  text-transform: none;
  padding: 0px 4px;
`;

// const mdOptions = {
//   linkTarget: '_blank',
// };

function ImageInfo({ caption, credit, intl, below }) {
  return (
    <figcaption>
      <Styled align="end" below={below}>
        {caption && (
          <Caption className="rle-caption-markdown">
            <MarkdownWrapper content={caption} />
          </Caption>
        )}
        {credit && (
          <Credit className="rle-caption-markdown">
            <MarkdownWrapper
              content={`${intl.formatMessage(
                  commonMessages.imageCreditBy,
                )} ${credit}`}
            />
          </Credit>
        )}
      </Styled>
    </figcaption>
  );
}

ImageInfo.propTypes = {
  credit: PropTypes.string,
  caption: PropTypes.string,
  below: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ImageInfo);
