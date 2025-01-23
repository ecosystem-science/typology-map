/**
 *
 * Map
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Heading, Paragraph, Text } from 'grommet';
import { FormattedMessage, injectIntl } from 'react-intl';

import ButtonText from 'components/ButtonText';
import AttributionLink from './AttributionLink';

import messages from './messages';

const StyledHeading = styled(Heading)`
  margin: 0;
`;

export function MapAttribution({ onFeedbackClick, intl }) {
  return (
    <Box
      pad="small"
      margin={{ bottom: 'xsmall' }}
      background="white"
      elevation="small"
      width={{ max: 'medium' }}
    >
      <StyledHeading level={5}>
        <FormattedMessage {...messages.mapAttribution} />
      </StyledHeading>
      <Box margin={{ vertical: 'small' }}>
        <StyledHeading level={6}>
          <FormattedMessage {...messages.mapAttributionGroupsTitle} />
        </StyledHeading>
        <Paragraph size="xxsmall" margin={{ bottom: 'xsmall' }}>
          <FormattedMessage {...messages.mapAttributionGroupsInfo} />
        </Paragraph>
        <ButtonText
          onClick={() => onFeedbackClick()}
          label={
            <Text size="xxsmall">
              <FormattedMessage {...messages.mapAttributionGroupsLink} />
            </Text>
          }
        />
      </Box>
      <Box>
        <StyledHeading level={6}>
          <FormattedMessage {...messages.mapAttributionBasemapsTitle} />
        </StyledHeading>
        <Paragraph size="xxsmall" margin={{ bottom: 'xsmall' }}>
          <FormattedMessage {...messages.mapAttributionBasemapsInfo} />
        </Paragraph>
        <AttributionLink href="https://www.mapbox.com/about/maps/">
          © Mapbox
        </AttributionLink>
        <AttributionLink href="http://www.openstreetmap.org/copyright">
          © OpenStreetMap
        </AttributionLink>
        <AttributionLink underline href="https://www.mapbox.com/map-feedback/">
          <FormattedMessage {...messages.mapAttributionBasemapsLink} />
        </AttributionLink>
      </Box>
      <Box margin={{ vertical: 'small' }}>
        <StyledHeading level={6}>
          <FormattedMessage {...messages.mapAttributionRegionsTitle} />
        </StyledHeading>
        <Paragraph size="xxsmall" margin={{ bottom: 'xsmall' }}>
          <FormattedMessage {...messages.mapAttributionRegionsInfoADM} />
        </Paragraph>
        <AttributionLink
          underline
          href={intl.formatMessage(messages.mapAttributionRegionsLinkURLADM)}
        >
          <FormattedMessage {...messages.mapAttributionRegionsLinkADM} />
        </AttributionLink>
        <Paragraph size="xxsmall" margin={{ bottom: 'xsmall' }}>
          <FormattedMessage {...messages.mapAttributionRegionsInfoLME} />
        </Paragraph>
        <AttributionLink
          underline
          href={intl.formatMessage(messages.mapAttributionRegionsLinkURLLME)}
        >
          <FormattedMessage {...messages.mapAttributionRegionsLinkLME} />
        </AttributionLink>
      </Box>
    </Box>
  );
}

MapAttribution.propTypes = {
  onFeedbackClick: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(MapAttribution);
