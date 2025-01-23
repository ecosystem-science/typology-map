import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Box, Text, ResponsiveContext, Drop, Layer } from 'grommet';
import styled from 'styled-components';

import { DEFAULT_LOCALE } from 'i18n';

import { isMinSize, isMaxSize } from 'utils/responsive';

import { Close, Down, Up } from 'components/Icons';

import TypologyFilterOptions from './TypologyFilterOptions';
import FieldLabel from './FieldLabel';
import messages from './messages';

const FieldWrap = styled(p => <Box margin={{ bottom: 'medium' }} {...p} />)``;

const DropButton = styled(
  React.forwardRef((p, ref) => (
    <Button plain alignSelf="stretch" {...p} ref={ref} />
  )),
)`
  min-height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.global.colors['light-4']};
  padding: 3px 6px;
`;

const CloseButton = styled(p => <Button plain {...p} />)`
  border-radius: 9999px;
  padding: 6px;
  &:hover {
    background: ${({ theme }) => theme.global.colors.grey} !important;
  }
`;

const LabelWrap = styled(p => (
  <Box direction="row" align="start" fill="horizontal" gap="small" {...p} />
))``;
const Id = styled(p => <Box flex={{ shrink: 0 }} {...p} />)`
  color: ${({ theme }) => theme.global.colors['dark-grey']};
  min-width: 45px;
`;
const IdActive = styled(Id)`
  min-width: 30px;
`;
const Title = styled(Box)``;
const Active = styled(p => (
  <Box justify="between" direction="row" align="center" {...p} />
))`
  min-height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.global.colors['light-4']};
  padding: 3px 6px;
`;
const Select = styled(p => (
  <Box justify="between" direction="row" align="center" {...p} />
))``;
export function TypologyFilter({
  type,
  options,
  active,
  onDismiss,
  onSelect,
  intl,
}) {
  const [open, setOpen] = useState(false);
  const dropButtonRef = useRef(null);
  const { locale } = intl;
  // prettier-ignore
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <FieldWrap>
          <FieldLabel>
            {type === 'realms' && (
              <FormattedMessage {...messages.addFiltersByRealmLabel} />
            )}
            {type === 'biomes' && (
              <FormattedMessage {...messages.addFiltersByBiomeLabel} />
            )}
          </FieldLabel>
          {active && (
            <Active>
              <LabelWrap align="center">
                <IdActive>{active.id}</IdActive>
                <Title>{active.title[locale] || active.title[DEFAULT_LOCALE]}</Title>
              </LabelWrap>
              <CloseButton
                onClick={() => onDismiss()}
                icon={<Close size="medium" color="black" />}
              />
            </Active>
          )}
          {!active && (
            <DropButton
              ref={dropButtonRef}
              label={
                <Select pad={{ right: '3px' }}>
                  <Text color="dark-4">
                    {type === 'realms' &&
                      intl.formatMessage(messages.addFiltersByRealmPlaceholder)}
                    {type === 'biomes' &&
                      intl.formatMessage(messages.addFiltersByBiomePlaceholder)}
                  </Text>
                  {open ? <Up color="black" /> : <Down color="black" />}
                </Select>
              }
              onClick={() => setOpen(!open)}
            />
          )}
          {isMinSize(size, 'medium') &&
            !active &&
            open &&
            dropButtonRef &&
            dropButtonRef.current && (
            <Drop
              stretch
              target={dropButtonRef.current}
              align={{ top: 'bottom', right: 'right' }}
              style={{ maxWidth: dropButtonRef.current.offsetWidth }}
            >
              <TypologyFilterOptions
                dropWidth={`${dropButtonRef.current.offsetWidth}px`}
                onSubmit={id => {
                  onSelect(id);
                  setOpen(false);
                }}
                options={options}
              />
            </Drop>
          )}
          {isMaxSize(size, 'small') &&
            !active &&
            open && (
            <Layer
              full
              plain
              onEsc={() => setOpen(false)}
            >
              <TypologyFilterOptions
                dropWidth="100%"
                onSubmit={id => {
                  onSelect(id);
                  setOpen(false);
                }}
                options={options}
                inLayer
                onClose={() => setOpen(false)}
                type={type}
              />
            </Layer>
          )}
        </FieldWrap>
      )}
    </ResponsiveContext.Consumer>
  );
}

TypologyFilter.propTypes = {
  type: PropTypes.string,
  options: PropTypes.array,
  active: PropTypes.object,
  onDismiss: PropTypes.func,
  onSelect: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TypologyFilter);
