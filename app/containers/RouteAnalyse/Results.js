/**
 *
 * RouteExplore
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import CsvDownloader from 'react-csv-downloader';

import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Box, Text, Button, ResponsiveContext } from 'grommet';
import { FormattedMessage, injectIntl } from 'react-intl';

import quasiEquals from 'utils/quasi-equals';
import { isMinSize } from 'utils/responsive';

import { GROUP_LAYER_PROPERTIES, QUERY_REGIONS_LAYER, PATHS } from 'config';

import {
  selectQueryGroups,
  selectGroupsQueryReadyAll,
  selectGroupsByAreaArgs,
  selectActiveGroup,
  selectQueryType,
} from 'containers/App/selectors';
import {
  resetGroupsQuery,
  resetGroupsQueryNav,
  setActiveGroupQuery,
  setInfoGroupQuery,
} from 'containers/App/actions';
import { selectLayerByKey } from 'containers/Map/selectors';
import ButtonPrimary from 'components/ButtonPrimary';
import A from 'components/styled/A';
import AsideNavTypologyList from 'components/AsideNavTypologyList';
import LoadingIndicator from 'components/LoadingIndicator';
import AsideNavSection from 'components/AsideNavSection';
import TooltipOccurrence from 'components/Tooltip/TooltipOccurrence';
import SectionTitle from 'components/styled/SectionTitle';

import commonMessages from 'messages';
import messages from './messages';

import { getCSVColumns, prepareCSVData, generateCSVFilename } from './utils';

import ResultsFilters from './ResultsFilters';

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

const TextLabel = styled(props => <Text size="xsmall" {...props} />)``;
const SettingTitle = styled(props => <Text size="xsmall" {...props} />)`
  font-weight: 600;
`;

export function Results({
  resultGroups,
  queriesReady,
  onCancelQuery,
  onResetQuery,
  queryArgs,
  queryArgsFromQuery,
  intl,
  realms,
  biomes,
  onSetActiveGroup,
  activeGroup,
  onSetInfoGroup,
  queryType,
  regionLayer,
  setAreaUpdate,
  setFilterUpdate,
}) {
  const { locale } = intl;
  let { area, realm, biome, occurrence, regionId } = queryArgs;

  if (queriesReady && queryArgsFromQuery) {
    area = queryArgsFromQuery.area;
    regionId = queryArgsFromQuery.regionId;
    realm = queryArgsFromQuery.realm;
    biome = queryArgsFromQuery.biome;
    occurrence = queryArgsFromQuery.occurrence;
  }

  const activeRegion =
    queryType === 'region' &&
    regionId &&
    regionLayer &&
    regionLayer.data.features.find(feature =>
      quasiEquals(feature.properties[QUERY_REGIONS_LAYER.featureId], regionId),
    );

  // const resultGroups = queryType === 'region' ? groupsForRegion : groupsForArea;

  // prettier-ignore
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <Box
            pad={{ horizontal: 'small', top: 'small' }}
            flex={false}
            background="white"
            direction="row"
            fill="horizontal"
            justify="between"
            align="center"
            gap="small"
          >
            <SectionTitle variant="aside" style={{ margin: '30px 0' }}>
              <FormattedMessage {...messages.queryResults} />
            </SectionTitle>
            <Box flex={{ shrink: 0 }}>
              {queriesReady && (
                <ButtonPrimary
                  onClick={() => onResetQuery()}
                  label={
                    <FormattedMessage
                      {...messages[isMinSize(size, 'large')
                        ? 'resetQueryLabel'
                        : 'resetQueryLabelSmall']
                      }
                    />
                  }
                />
              )}
              {!queriesReady && (
                <ButtonPrimary
                  onClick={() => onCancelQuery()}
                  label={
                    <FormattedMessage
                      {...messages[isMinSize(size, 'large')
                        ? 'cancelQueryLabel'
                        : 'cancelQueryLabelSmall']
                      }
                    />
                  }
                />
              )}
            </Box>
          </Box>
          <Box pad={{ bottom: 'large' }} flex={false} background="white">
            <AsideNavSection margin="0">
              <Box
                pad={{ horizontal: 'small' }}
                margin={{ bottom: 'medium' }}
                flex={false}
              >
                {!queriesReady && (
                  <FormattedMessage {...messages.awaitResults} />
                )}
                {queriesReady && resultGroups.length === 0 && (
                  <FormattedMessage {...messages.noResults} />
                )}
                {queriesReady &&
                  resultGroups.length > 0 && (
                  <div>
                    {queryType === 'region' && (
                      <FormattedMessage {...messages.hintResultsRegion} />
                    )}
                    {queryType === 'area' && (
                      <FormattedMessage {...messages.hintResultsArea} />
                    )}
                    <FormattedMessage
                      {...messages.download}
                      values={{
                        link: (
                          <A href={PATHS.DATA_DOWNLOAD} target="_blank">
                            {intl.formatMessage(messages.downloadAnchor)}
                          </A>
                        ),
                      }}
                    />
                  </div>
                )}
              </Box>
            </AsideNavSection>
            {!queriesReady && <LoadingIndicator />}
            {queriesReady && (
              <ResultsFilters
                queryArgs={{
                  area,
                  realm,
                  biome,
                  occurrence,
                }}
                realms={realms}
                biomes={biomes}
                queryType={queryType}
                activeRegion={activeRegion}
                enableAreaUpdate={() => {
                  onSetActiveGroup('');
                  setAreaUpdate(true);
                }}
                enableFilterUpdate={() => setFilterUpdate(true)}
              />
            )}
            {queriesReady && resultGroups && resultGroups.length > 0 && (
              <AsideNavSection margin={{ top: 'ml' }}>
                <Box pad={{ horizontal: 'small' }} flex={false}>
                  <StepTitleWrap>
                    <Box>
                      <Text size="large">
                        <strong>
                          {`${resultGroups.length} ${intl.formatMessage(
                            commonMessages.groups,
                          )}`}
                        </strong>
                      </Text>
                    </Box>
                    {queriesReady && resultGroups.length > 0 && (
                      <CsvDownloader
                        datas={prepareCSVData(
                          resultGroups,
                          queryType,
                          queryArgsFromQuery,
                          realms,
                          biomes,
                          activeRegion,
                          intl,
                        )}
                        columns={getCSVColumns(queryType, intl)}
                        filename={generateCSVFilename(queryArgsFromQuery, locale)}
                        suffix
                        wrapColumnChar='"'
                      >
                        <UpdateButton
                          onClick={e => e.preventDefault()}
                          label={<FormattedMessage {...messages.downloadResultsLabel} />}
                        />
                      </CsvDownloader>
                    )}
                  </StepTitleWrap>
                  {queryType === 'region' && (
                    <Box pad={{ bottom: 'xsmall' }}>
                      <Text size="xsmall">
                        <FormattedMessage {...messages.hintResultsGraph} />
                      </Text>
                    </Box>
                  )}
                  {queryType === 'region' && (
                    <Box direction="row" gap="small" pad={{ bottom: 'small' }}>
                      <SettingTitle>
                        <FormattedMessage {...commonMessages.occurrence} />
                        {`: `}
                      </SettingTitle>
                      {Object.keys(GROUP_LAYER_PROPERTIES.OCCURRENCE).map(
                        key => (
                          <Box
                            direction="row"
                            align="center"
                            gap="xsmall"
                            key={key}
                          >
                            <KeyColor
                              color={
                                GROUP_LAYER_PROPERTIES.OCCURRENCE[key].color
                              }
                              opacity={1}
                            />
                            <TextLabel>
                              <FormattedMessage
                                {...commonMessages[
                                  `occurrence_${
                                    GROUP_LAYER_PROPERTIES.OCCURRENCE[key].id
                                  }`
                                ]}
                              />
                            </TextLabel>
                          </Box>
                        ),
                      )}
                      <TooltipOccurrence />
                    </Box>
                  )}
                </Box>
                <AsideNavTypologyList
                  items={resultGroups}
                  level={2}
                  locale={locale}
                  selectItem={id =>
                    onSetActiveGroup(activeGroup === id ? '' : id)
                  }
                  activeId={activeGroup}
                  infoItem={id => onSetInfoGroup(id)}
                  showAreas
                />
              </AsideNavSection>
            )}
          </Box>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
}

Results.propTypes = {
  resultGroups: PropTypes.array,
  queriesReady: PropTypes.bool,
  queryArgsFromQuery: PropTypes.object,
  queryArgs: PropTypes.object,
  onResetQuery: PropTypes.func,
  onCancelQuery: PropTypes.func,
  onSetActiveGroup: PropTypes.func,
  onSetInfoGroup: PropTypes.func,
  intl: PropTypes.object.isRequired,
  realms: PropTypes.array,
  biomes: PropTypes.array,
  activeGroup: PropTypes.string,
  queryType: PropTypes.string,
  regionLayer: PropTypes.object,
  setAreaUpdate: PropTypes.func,
  setFilterUpdate: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  queriesReady: state => selectGroupsQueryReadyAll(state),
  queryArgsFromQuery: state => selectGroupsByAreaArgs(state),
  activeGroup: state => selectActiveGroup(state),
  resultGroups: state => selectQueryGroups(state),
  queryType: state => selectQueryType(state),
  regionLayer: state => selectLayerByKey(state, QUERY_REGIONS_LAYER.key),
});

function mapDispatchToProps(dispatch) {
  return {
    onResetQuery: () => {
      dispatch(resetGroupsQuery());
      dispatch(resetGroupsQueryNav());
      dispatch(setActiveGroupQuery(''));
    },
    onCancelQuery: () => {
      dispatch(resetGroupsQuery());
      dispatch(setActiveGroupQuery(''));
    },
    onSetActiveGroup: id => dispatch(setActiveGroupQuery(id)),
    onSetInfoGroup: id => dispatch(setInfoGroupQuery(id)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// export default RouteExplore;
export default compose(withConnect)(injectIntl(Results));
