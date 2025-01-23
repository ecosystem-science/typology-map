/**
 *
 * RouteExplore
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box, Text, Button } from 'grommet';
import { FormattedMessage, injectIntl } from 'react-intl';

import { GROUP_LAYER_PROPERTIES } from 'config';
import { DEFAULT_LOCALE } from 'i18n';

import { getRegionFeatureTitle } from 'containers/Map/utils';

import AsideNavSection from 'components/AsideNavSection';
import Hint from 'components/Hint';

import TooltipOccurrence from 'components/Tooltip/TooltipOccurrence';

import commonMessages from 'messages';
import messages from './messages';

import { getOpenArea } from './utils';

import StepTitle from './StepTitle';
import FieldWrap from './FieldWrap';
import FieldLabel from './FieldLabel';

const Active = styled(p => (
  <Box justify="between" direction="row" align="center" {...p} />
))``;
const LabelWrap = styled(p => (
  <Box direction="row" align="start" fill="horizontal" gap="small" {...p} />
))``;
const Id = styled(p => <Box flex={{ shrink: 0 }} {...p} />)`
  color: ${({ theme }) => theme.global.colors['dark-grey']};
`;
const Title = styled(Box)``;

const StyledStepTitle = styled(p => <StepTitle size="small" {...p} />)`
  margin-bottom: 0;
`;

const StepTitleWrap = styled(p => (
  <Box direction="row" align="center" justify="between" {...p} />
))`
  margin-bottom: 10px;
`;

const UpdateButton = styled(p => <Button plain {...p} />)`
  color: ${({ theme }) => theme.global.colors.brand};
  font-size: ${({ theme }) => theme.text.xsmall.size};
  line-height: ${({ theme }) => theme.text.xsmall.height};
  &:hover {
    text-decoration: underline;
  }
`;

const KeyColor = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 2px 0;
  background: ${({ color }) => color};
  opacity: ${({ opacity }) => opacity};
`;

export function ResultsFilters({
  queryArgs,
  realms,
  biomes,
  queryType,
  enableAreaUpdate,
  enableFilterUpdate,
  activeRegion,
  intl,
}) {
  const { locale } = intl;
  const { area, realm, biome, occurrence } = queryArgs;
  const hasFilters = realm || biome || occurrence;
  const realmObject = realms && realms.find(r => r.id === realm);
  const biomeObject = biomes && biomes.find(b => b.id === biome);

  // prettier-ignore
  return (
    <Box pad={{ horizontal: 'small', top: 'small' }} flex={false}>
      <AsideNavSection margin="none">
        <StepTitleWrap>
          <StyledStepTitle>
            <FormattedMessage {...messages.area} />
          </StyledStepTitle>
          <UpdateButton
            onClick={() => enableAreaUpdate()}
            label={<FormattedMessage {...messages.areaChange} />}
          />
        </StepTitleWrap>
        <FieldWrap>
          <FieldLabel>
            {queryType === 'area' && (
              <FormattedMessage {...messages.customArea} />
            )}
            {queryType === 'region' && (
              <FormattedMessage {...messages.predefinedRegion} />
            )}
          </FieldLabel>
          {queryType === 'area' && (
            <Text truncate>{getOpenArea(area)}</Text>
          )}
          {queryType === 'region' && (
            <Text>{getRegionFeatureTitle(activeRegion, locale)}</Text>
          )}
        </FieldWrap>
      </AsideNavSection>
      <AsideNavSection margin="none">
        <StepTitleWrap>
          <StyledStepTitle>
            <FormattedMessage {...messages.filters} />
          </StyledStepTitle>
          <UpdateButton
            onClick={() => enableFilterUpdate()}
            label={
              <FormattedMessage
                {...messages[
                  hasFilters ? 'filtersChange' : 'filtersAdd'
                ]}
              />
            }
          />
        </StepTitleWrap>
        {!hasFilters && (
          <Hint>
            <FormattedMessage {...messages.noFilters} />
          </Hint>
        )}
        {realm && (
          <FieldWrap
            margin={{
              bottom: (biome || occurrence) ? 'small' : 'none',
            }}
          >
            <FieldLabel>
              <FormattedMessage {...commonMessages.realm} />
            </FieldLabel>
            <Active>
              <LabelWrap align="center">
                <Id>{realmObject.id}</Id>
                <Title>{realmObject.title[locale] || realmObject.title[DEFAULT_LOCALE]}</Title>
              </LabelWrap>
            </Active>
          </FieldWrap>
        )}
        {biome && (
          <FieldWrap margin={{ bottom: occurrence ? 'small' : 'none'}}>
            <FieldLabel>
              <FormattedMessage {...commonMessages.biome} />
            </FieldLabel>
            <Active>
              <LabelWrap align="center">
                <Id>{biomeObject.id}</Id>
                <Title>{biomeObject.title[locale] || biomeObject.title[DEFAULT_LOCALE]}}</Title>
              </LabelWrap>
            </Active>
          </FieldWrap>
        )}
        {occurrence && (
          <FieldWrap margin="none">
            <Box
              direction="row"
              gap="small"
              align="center"
              margin={{ top: 'xxsmall', bottom: 'xsmall' }}
            >
              <FieldLabel noMargin>
                <FormattedMessage {...commonMessages.occurrence} />
              </FieldLabel>
              <TooltipOccurrence />
            </Box>
            <Active>
              <LabelWrap align="center">
                <KeyColor
                  color={
                    GROUP_LAYER_PROPERTIES.OCCURRENCE[occurrence].color
                  }
                />
                <FormattedMessage
                  {...commonMessages[
                    `occurrence_${
                      GROUP_LAYER_PROPERTIES.OCCURRENCE[occurrence].id
                    }`
                  ]}
                />
              </LabelWrap>
            </Active>
          </FieldWrap>
        )}
      </AsideNavSection>
    </Box>
  );
}

ResultsFilters.propTypes = {
  queryArgs: PropTypes.object,
  realms: PropTypes.array,
  biomes: PropTypes.array,
  queryType: PropTypes.string,
  enableAreaUpdate: PropTypes.func,
  enableFilterUpdate: PropTypes.func,
  activeRegion: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

// export default RouteExplore;
export default injectIntl(ResultsFilters);
