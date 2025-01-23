/*
 * SectionThanks
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Box, Button } from 'grommet';
import { LOGOS } from 'config';
import styled from 'styled-components';

import coreMessages from 'messages';

import messages from './messages';

const ImageButton = styled(Button)`
  height: 65px;
  background-image: url(${({ src }) => src});
  background-blend-mode: multiply;
  background-color: ${({ theme }) => theme.global.colors['light-2']};
  background-size: contain;
  background-position: center center;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    height: 80px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    height: 120px;
  }
  border-bottom: 1px solid transparent;
  &:focus {
    outline: 0;
    border-bottom: 1px solid ${({ theme }) => theme.global.colors.brand};
  }
`;

const ImageWrap = styled(Box)`
  width: 33%;
  @media (min-width: 500px) {
    width: ${({ count }) => 100 / count}%;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  line-height: 24px;
  margin: 20px 0;
`;

export function Partners({ intl }) {
  return (
    <>
      <Box>
        <SectionTitle>
          <FormattedMessage {...messages.titleThanks} />
        </SectionTitle>
      </Box>
      <Box direction="row" align="center" wrap>
        {LOGOS &&
          Object.values(LOGOS).map(logo => {
            const alt = `partner_${logo.id}`;
            const url = `partner_${logo.id}_url`;
            return (
              <ImageWrap
                key={logo.id}
                pad="xsmall"
                margin={{ bottom: 'medium' }}
                count={Object.keys(LOGOS).length}
              >
                <ImageButton
                  plain
                  as="a"
                  href={intl.formatMessage(coreMessages[url])}
                  target="_blank"
                  src={logo.src}
                  title={intl.formatMessage(coreMessages[alt])}
                  fill="vertical"
                />
              </ImageWrap>
            );
          })}
      </Box>
    </>
  );
}
Partners.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Partners);
