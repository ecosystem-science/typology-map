/**
 *
 * RouteExplore
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Box, Button } from 'grommet';
import { FormattedMessage, injectIntl } from 'react-intl';

import { selectGroupsByAreaArgs } from 'containers/App/selectors';

import AsideNavSection from 'components/AsideNavSection';
import ButtonPrimary from 'components/ButtonPrimary';

import messages from './messages';

import { getRealmOptions, getBiomeOptions } from './utils';

import TypologyFilter from './TypologyFilter';
import StepTitle from './StepTitle';
import FieldWrap from './FieldWrap';
import OccurrenceInput from './OccurrenceInput';

const UpdateButton = styled(p => <Button plain {...p} />)`
  color: ${({ theme }) => theme.global.colors.brand};
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(p => <ButtonPrimary {...p} />)``;

export function ConfigureFilters({
  queryArgs,
  queryArgsFromQuery,
  intl,
  updateQuery,
  onQueryGroups,
  realms,
  biomes,
  onCancel,
  onSubmit,
}) {
  const { realm, biome, occurrence } = queryArgs;
  const areaQ = queryArgsFromQuery && queryArgsFromQuery.area;
  const regionQ = queryArgsFromQuery && queryArgsFromQuery.regionId;
  const realmQ = queryArgsFromQuery && queryArgsFromQuery.realm;
  const biomeQ = queryArgsFromQuery && queryArgsFromQuery.biome;
  const occurrenceQ = queryArgsFromQuery && queryArgsFromQuery.occurrence;

  const realmObject = realms && realms.find(r => r.id === realm);
  const biomeObject = biomes && biomes.find(b => b.id === biome);
  // figure out options from any other filters set
  const realmOptions = getRealmOptions(realms, biomeObject);
  const biomeOptions = getBiomeOptions(realms, biomes, realmObject);

  // only activate queryUpdate when area has actually changed
  let filtersChanged = false;
  if (queryArgsFromQuery) {
    filtersChanged =
      realm !== (realmQ || '') ||
      biome !== (biomeQ || '') ||
      occurrence !== (occurrenceQ || '');
  }

  return (
    <>
      <AsideNavSection margin={{ vertical: 'ms' }}>
        <StepTitle>
          <FormattedMessage {...messages.filtersChange} />
        </StepTitle>
        <TypologyFilter
          type="realms"
          options={realmOptions}
          active={realmObject}
          onSelect={id => {
            updateQuery({
              ...queryArgs,
              realm: id,
            });
          }}
          onDismiss={() => {
            updateQuery({
              ...queryArgs,
              realm: '',
            });
          }}
        />
        <TypologyFilter
          type="biomes"
          options={biomeOptions}
          active={biomeObject}
          onSelect={id => {
            updateQuery({
              ...queryArgs,
              biome: id,
            });
          }}
          onDismiss={() => {
            updateQuery({
              ...queryArgs,
              biome: '',
            });
          }}
        />
        <FieldWrap margin={{ bottom: '0' }}>
          <OccurrenceInput
            occurrence={occurrence}
            onSubmit={value =>
              updateQuery({
                ...queryArgs,
                occurrence: value,
              })
            }
          />
        </FieldWrap>
      </AsideNavSection>
      <Box direction="row" gap="small" margin={{ top: 'small' }}>
        <SubmitButton
          disabled={!filtersChanged}
          label={intl.formatMessage(messages.updateQueryLabel)}
          onClick={() => {
            onSubmit();
            onQueryGroups({
              area: areaQ,
              regionId: regionQ,
              realm: realm && realm.trim() !== '' ? realm : null,
              biome: biome && biome.trim() !== '' ? biome : null,
              occurrence:
                occurrence && occurrence.trim() !== '' ? occurrence : null,
            });
          }}
        />
        <UpdateButton
          onClick={() => {
            onCancel();
            updateQuery(queryArgsFromQuery);
          }}
          label={<FormattedMessage {...messages.cancel} />}
        />
      </Box>
    </>
  );
}

ConfigureFilters.propTypes = {
  queryArgsFromQuery: PropTypes.object,
  queryArgs: PropTypes.object,
  intl: PropTypes.object.isRequired,
  updateQuery: PropTypes.func,
  onQueryGroups: PropTypes.func,
  realms: PropTypes.array,
  biomes: PropTypes.array,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  queryArgsFromQuery: state => selectGroupsByAreaArgs(state),
});

const withConnect = connect(mapStateToProps, null);

// export default RouteExplore;
export default compose(withConnect)(injectIntl(ConfigureFilters));
