/**
 *
 * Search
 *
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import styled from 'styled-components';
import { Box, Text, Button, ResponsiveContext } from 'grommet';

import { Close, Search as SearchIcon } from 'components/Icons';

import {
  selectGroups,
  selectBiomes,
  selectRealms,
} from 'containers/App/selectors';
import { navigateTypology } from 'containers/App/actions';
import { isMinSize, isMaxSize, getHeaderHeight } from 'utils/responsive';

import ColumnAside from 'components/ColumnAside';

import messages from './messages';
import SearchResults from './SearchResults';
import TextInput from './TextInput';
import { prepTaxonomies, sanitise } from './search';

const Styled = styled(Box)``;
// const HintWrap = styled.div``;
const HintWrap = styled(p => <Box fill pad="medium" {...p} />)``;
const Hint = styled(p => <Text size="small" color="dark-4" {...p} />)``;

const SearchResultWrap = styled.div`
  position: fixed;
  top: ${getHeaderHeight('small')}px;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  overflow-y: auto;
`;

const CloseButton = styled(p => <Button plain fill="vertical" {...p} />)`
  fill: black;
  &:focus {
    fill: ${({ theme }) => theme.global.colors.brand} !important;
  }
`;

export function Search({
  stretch,
  expand,
  onClose,
  onSearch,
  focus = true,
  groups,
  biomes,
  realms,
  onNavigateTypology,
  intl,
  placeholder,
}) {
  const [search, setSearch] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const textInputRef = useRef(null);

  useEffect(() => {
    if ((focus || expand) && textInputRef) {
      textInputRef.current.focus();
    }
  }, [focus, expand]);

  const filteredGroups = prepTaxonomies(groups, search);
  const filteredRealms = prepTaxonomies(realms, search);
  const filteredBiomes = prepTaxonomies(biomes, search);
  const total =
    search !== ''
      ? filteredGroups.length + filteredBiomes.length + filteredRealms.length
      : 0;
  // prettier-ignore
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Styled fill="horizontal">
          <Box
            direction="row"
            align="center"
            round="xxsmall"
            style={stretch ? null : { maxWidth: '500px' }}
            pad={{ horizontal: 'small', vertical: 'xxsmall' }}
            background="white"
          >
            <TextInput
              plain
              value={search}
              onChange={evt => {
                if (evt && evt.target) {
                  setSearch(sanitise(evt.target.value));
                  if (onSearch) onSearch(sanitise(evt.target.value));
                  setActiveResult(0);
                }
              }}
              placeholder={
                placeholder || intl.formatMessage(messages.placeholder)
              }
              ref={textInputRef}
            />
            {!onClose && search.length === 0 && (
              <Box pad={{ right: 'small' }}>
                <SearchIcon size="medium" color="dark" />
              </Box>
            )}
            {(onClose || search.length > 0) && (
              <CloseButton
                onClick={() => {
                  setSearch('');
                  if (onSearch) onSearch('');
                  if (onClose) onClose();
                  setActiveResult(0);
                }}
                icon={<Close size="medium" />}
              />
            )}
          </Box>
          {isMaxSize(size, 'medium') && (
            <SearchResultWrap>
              {total > 0 && (
                <SearchResults
                  onClose={() => {
                    setSearch('');
                    if (onSearch) onSearch('');
                    setActiveResult(0);
                  }}
                  search={search}
                  onSelect={(level, id) => {
                    if (onClose) onClose();
                    onNavigateTypology(level, id);
                  }}
                  activeResult={activeResult}
                  setActiveResult={setActiveResult}
                  groups={filteredGroups}
                  realms={filteredRealms}
                  biomes={filteredBiomes}
                  maxResult={total}
                />
              )}
              {total === 0 && search.trim().length > 2 && (
                <HintWrap>
                  <Hint><FormattedMessage {...messages.noResults} /></Hint>
                </HintWrap>
              )}
              {total === 0 && search.trim().length <= 2 && (
                <HintWrap>
                  <Hint><FormattedMessage {...messages.resultHint} /></Hint>
                </HintWrap>
              )}
            </SearchResultWrap>
          )}
          {isMinSize(size, 'large') &&
            (total > 0 || search.trim().length > 2) && (
            <ColumnAside>
              {total > 0 && (
                <SearchResults
                  onClose={() => {
                    setSearch('');
                    if (onSearch) onSearch('');
                    setActiveResult(0);
                  }}
                  search={search}
                  onSelect={(level, id) => {
                    if (onClose) onClose();
                    onNavigateTypology(level, id);
                  }}
                  activeResult={activeResult}
                  setActiveResult={setActiveResult}
                  groups={filteredGroups}
                  realms={filteredRealms}
                  biomes={filteredBiomes}
                  maxResult={total}
                />
              )}
              {total === 0 && (
                <HintWrap>
                  <Hint><FormattedMessage {...messages.noResults} /></Hint>
                </HintWrap>
              )}
            </ColumnAside>
          )}
        </Styled>
      )}
    </ResponsiveContext.Consumer>
  );
}

Search.propTypes = {
  onSearch: PropTypes.func,
  onClose: PropTypes.func,
  onNavigateTypology: PropTypes.func,
  stretch: PropTypes.bool,
  expand: PropTypes.bool,
  focus: PropTypes.bool,
  placeholder: PropTypes.string,
  groups: PropTypes.array,
  realms: PropTypes.array,
  biomes: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  // navigate to location
  onNavigateTypology: (level, id) => {
    dispatch(navigateTypology(level, id));
  },
});
const mapStateToProps = state => ({
  groups: selectGroups(state),
  biomes: selectBiomes(state),
  realms: selectRealms(state),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(Search));
