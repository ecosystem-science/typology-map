import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Box, Text } from 'grommet';
import styled from 'styled-components';

import { setRegionHighlight } from 'containers/Map/actions';

import TextInput from 'containers/Search/TextInput';
import {
  sanitise,
  cleanupSearchTarget,
  regExMultipleWords,
} from 'containers/Search/search';

import { Close } from 'components/Icons';

import messages from './messages';

const Styled = styled(Box)`
  position: ${({ inLayer }) => (inLayer ? 'absolute' : 'static')};
  left: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  top: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  right: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  bottom: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  overflow-y: ${({ inLayer }) => (inLayer ? 'hidden' : 'auto')};
  background: white;
`;
const Header = styled(Box)`
  height: 40px;
  background: ${({ theme }) => theme.global.colors['light-grey']};
  padding: ${({ theme }) => theme.global.edgeSize.xsmall};
  position: ${({ inLayer }) => (inLayer ? 'absolute' : 'static')};
  left: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  top: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  right: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
`;
const SearchWrap = styled(Box)``;
const TextInputWrap = styled(Box)`
  display: block;
  background: white;
  padding: ${({ theme }) => theme.global.edgeSize.hair}
    ${({ theme }) => theme.global.edgeSize.xxsmall};
`;

const Results = styled(Box)`
  position: ${({ inLayer }) => (inLayer ? 'absolute' : 'static')};
  left: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  top: ${({ inLayer }) => (inLayer ? '40px' : 'auto')};
  right: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  bottom: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  overflow-y: ${({ inLayer }) => (inLayer ? 'auto' : 'unset')};
`;
const ResultsInner = styled(Box)`
  padding: 8px 0;
`;

const LabelWrap = styled(p => <Box {...p} />)``;

const OptionButton = styled(p => <Button {...p} />)`
  &:hover {
    background: ${({ theme }) => theme.global.colors['light-grey']};
  }
`;

const CloseButton = styled(Button)`
  padding: 0 5px;
  &:hover {
    color: ${({ theme }) => theme.global.colors.brand};
  }
`;

export function RegionInputOptions({
  onSubmit,
  dropWidth,
  onSetRegionHighlight,
  options,
  inLayer,
  onClose,
  intl,
}) {
  const [search, setSearch] = useState('');
  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInputRef && textInputRef.current) {
      textInputRef.current.focus();
    }
    setSearch('');
  }, []);

  const filteredOptions = options.filter(option => {
    if (!search || search.trim().length === 0) return true;
    if (search.trim().length > 0) {
      try {
        const regex = new RegExp(regExMultipleWords(search), 'i');
        return regex.test(cleanupSearchTarget(option.title));
      } catch {
        return true;
      }
    }
    return false;
  });

  // onSelect={id => onSubmit(id)}
  // placeholder={intl.formatMessage(messages.selectRegionFieldPlaceholder)}
  return (
    <Styled inLayer={inLayer} style={{ maxWidth: dropWidth }}>
      <Header
        direction="row"
        flex={false}
        elevation={inLayer ? 'small' : 'none'}
        inLayer={inLayer}
      >
        <SearchWrap flex={{ grow: 1 }}>
          <TextInputWrap>
            <TextInput
              plain
              value={search}
              onChange={evt => {
                if (evt && evt.target) {
                  setSearch(sanitise(evt.target.value));
                }
              }}
              placeholder={intl.formatMessage(messages.filterRegions)}
              ref={textInputRef}
            />
          </TextInputWrap>
        </SearchWrap>
        {inLayer && onClose && (
          <CloseButton plain onClick={() => onClose()} label={<Close />} />
        )}
      </Header>
      <Results inLayer={inLayer}>
        {(!filteredOptions || filteredOptions.length === 0) && (
          <Box pad="small">
            <FormattedMessage {...messages.noRegionsFound} />
          </Box>
        )}
        {filteredOptions && (
          <ResultsInner flex={{ shrink: 0 }}>
            {filteredOptions.map(option => (
              <OptionButton
                key={option.id}
                plain
                label={
                  <LabelWrap pad={{ vertical: 'small', horizontal: 'small' }}>
                    <Text size="small" truncate>
                      {option.title}
                    </Text>
                  </LabelWrap>
                }
                onFocus={() => onSetRegionHighlight(option.id)}
                onMouseOver={() => onSetRegionHighlight(option.id)}
                onMouseOut={() => onSetRegionHighlight()}
                onBlur={() => onSetRegionHighlight()}
                onClick={() => {
                  setSearch('');
                  onSubmit(option.id);
                }}
              />
            ))}
          </ResultsInner>
        )}
      </Results>
    </Styled>
  );
}

RegionInputOptions.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onSetRegionHighlight: PropTypes.func,
  options: PropTypes.array,
  dropWidth: PropTypes.string,
  inLayer: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetRegionHighlight: regionId => dispatch(setRegionHighlight(regionId)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

// export default RouteExplore;
export default compose(withConnect)(injectIntl(RegionInputOptions));
// export default RegionInputOptions;
