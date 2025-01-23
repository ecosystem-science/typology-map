/*
 * SectionAnalysis
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Image, Box } from 'grommet';

import { AnalysePoly } from 'components/Icons';

import ButtonPrimary from 'components/ButtonPrimary';
import SectionTitle from 'components/styled/SectionTitle';
import SectionInner from 'components/styled/SectionInner';
import SectionOuter from 'components/styled/SectionOuter';
import SectionTeaser from 'components/styled/SectionTeaser';

import Map from 'images/map.png';

import messages from './messages';

const ImageWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
`;

export function SectionAnalysis({ intl, onClick }) {
  return (
    <SectionOuter background="white">
      <ImageWrap>
        <Image fill fit="cover" src={Map} alignSelf="start" />
      </ImageWrap>
      <SectionInner>
        <SectionTitle>
          <FormattedMessage {...messages.titleSectionAnalysis} />
        </SectionTitle>
        <SectionTeaser>
          <FormattedMessage {...messages.teaserSectionAnalysis} />
        </SectionTeaser>
        <Box
          align="center"
          fill="horizontal"
          margin={{ vertical: 'medium' }}
          responsive={false}
        >
          <ButtonPrimary
            icon={<AnalysePoly color="white" />}
            label={intl.formatMessage(messages.buttonSectionAnalysis)}
            onClick={onClick}
          />
        </Box>
      </SectionInner>
    </SectionOuter>
  );
}

SectionAnalysis.propTypes = {
  onClick: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SectionAnalysis);
