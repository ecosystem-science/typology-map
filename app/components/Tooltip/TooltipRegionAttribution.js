import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Box, Paragraph, Heading } from 'grommet';

import Tooltip from 'components/Tooltip';
import messages from './messages';
import AttributionLink from './AttributionLink';

function TooltipRegionAttribution({ intl }) {
  return (
    <Tooltip
      large
      color="light-grey"
      component={
        <Box flex={false} margin={{ bottom: 'xsmall' }}>
          <Heading level={5} style={{ margin: '10px 0 5px' }}>
            <FormattedMessage {...messages.mapAttributionRegionsTitle} />
          </Heading>
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
      }
    />
  );
}

TooltipRegionAttribution.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TooltipRegionAttribution);
