import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Box, Text } from 'grommet';
import styled from 'styled-components';
import { DEFAULT_LOCALE } from 'i18n';

import { Close } from 'components/Icons';
import messages from './messages';

const Id = styled(p => <Box flex={{ shrink: 0 }} {...p} />)`
  color: ${({ theme }) => theme.global.colors['dark-grey']};
  min-width: 45px;
`;
const Title = styled(Box)``;
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
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
`;

const Results = styled(Box)`
  position: ${({ inLayer }) => (inLayer ? 'absolute' : 'static')};
  left: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  top: ${({ inLayer }) => (inLayer ? '40px' : 'auto')};
  right: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  bottom: ${({ inLayer }) => (inLayer ? 0 : 'auto')};
  overflow-y: ${({ inLayer }) => (inLayer ? 'auto' : 'unset')};
  padding: 8px 0;
`;

const LabelWrap = styled(p => (
  <Box direction="row" align="start" fill="horizontal" gap="small" {...p} />
))``;

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

export function TypologyFilterOptions({
  onSubmit,
  dropWidth,
  options,
  inLayer,
  onClose,
  intl,
  type,
}) {
  const { locale } = intl;

  return (
    <Styled inLayer={inLayer} style={{ maxWidth: dropWidth }}>
      {inLayer && onClose && (
        <Header direction="row" flex={false} elevation="small" align="center">
          <Box flex={{ grow: 1 }}>
            <Text>
              {type === 'realms' && (
                <FormattedMessage {...messages.addFiltersByRealmPlaceholder} />
              )}
              {type === 'biomes' && (
                <FormattedMessage {...messages.addFiltersByBiomePlaceholder} />
              )}
            </Text>
          </Box>
          <CloseButton plain onClick={() => onClose()} label={<Close />} />
        </Header>
      )}
      <Results inLayer={inLayer}>
        {options &&
          options.map(option => (
            <OptionButton
              key={option.id}
              plain
              label={
                <LabelWrap pad={{ vertical: 'small', horizontal: 'small' }}>
                  <Id>{option.id}</Id>
                  <Title>{option.title[locale] || option.title[DEFAULT_LOCALE]}</Title>
                </LabelWrap>
              }
              onClick={() => {
                onSubmit(option.id);
              }}
            />
          ))}
      </Results>
    </Styled>
  );
}

TypologyFilterOptions.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  options: PropTypes.array,
  dropWidth: PropTypes.string,
  inLayer: PropTypes.bool,
  intl: PropTypes.object.isRequired,
  type: PropTypes.string,
};

// export default RouteExplore;
export default injectIntl(TypologyFilterOptions);
// export default RegionInputOptions;
