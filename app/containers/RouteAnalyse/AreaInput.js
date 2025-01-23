/**
 *
 *
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, TextInput, Box } from 'grommet';
import styled from 'styled-components';

import { toggleDraw } from 'containers/App/actions';

import { Close } from 'components/Icons';
import Hint from 'components/Hint';

import FieldWrap from './FieldWrap';
import FieldLabel from './FieldLabel';

import messages from './messages';

const AreaTextInput = styled(p => <TextInput {...p} />)`
  min-height: 35px;
  border: 0;
`;
const TextInputWrap = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.global.colors['light-4']};
  padding: 0 40px 0 6px;
  border-radius: 3px;
`;

const CloseButton = styled(p => <Button plain {...p} />)`
  position: absolute;
  top: 3px;
  right: 3px;
  border-radius: 9999px;
  padding: 6px;
  background: ${({ theme }) => theme.global.colors.white} !important;
  &:hover {
    background: ${({ theme }) => theme.global.colors.grey} !important;
  }
`;

export function AreaInput({ area, onSubmit, intl, onToggleDraw }) {
  useEffect(() => {
    onToggleDraw(true);
    return () => onToggleDraw(false);
  }, []);

  return (
    <Box>
      <Hint>
        <FormattedMessage {...messages.defineAreaInstructions} />
      </Hint>
      <FieldWrap margin={{ top: 'medium' }}>
        <FieldLabel>
          <FormattedMessage {...messages.defineAreaFieldLabel} />
        </FieldLabel>
        <TextInputWrap>
          <AreaTextInput
            value={area}
            placeholder={intl.formatMessage(
              messages.defineAreaFieldPlaceholder,
            )}
            onChange={e => {
              const cursor = e.target.selectionStart;
              const element = e.target;
              window.requestAnimationFrame(() => {
                element.selectionStart = cursor;
                element.selectionEnd = cursor;
              });
              onSubmit(e.target.value);
            }}
          />
          {area && (
            <CloseButton
              onClick={() => onSubmit('')}
              icon={<Close size="medium" color="black" />}
            />
          )}
        </TextInputWrap>
      </FieldWrap>
    </Box>
  );
}

AreaInput.propTypes = {
  onSubmit: PropTypes.func,
  onToggleDraw: PropTypes.func,
  area: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    onToggleDraw: active => dispatch(toggleDraw(active)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

// export default RouteExplore;
export default compose(withConnect)(injectIntl(AreaInput));
