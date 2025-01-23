/**
 *
 * AnalysisShortcut
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Box, Paragraph } from 'grommet';

import { AnalysePoly } from 'components/Icons';
import ButtonPrimary from 'components/ButtonPrimary';
import H4 from 'components/styled/H4';
import messages from './messages';

const StyledPara = styled(Paragraph)`
  margin-bottom: ${({ theme }) => theme.global.edgeSize.small};
`;

export function AnalysisShortcut({ type, name, onClick, intl }) {
  return (
    <Box flex={false} align="start" margin={{ top: 'large' }}>
      <H4>
        <FormattedMessage
          {...messages[`header_${type}`]}
          values={{
            name,
          }}
        />
      </H4>
      <StyledPara responsive={false}>
        <FormattedMessage {...messages[`text_${type}`]} />
      </StyledPara>
      <ButtonPrimary
        icon={<AnalysePoly color="white" />}
        label={intl.formatMessage(messages.button)}
        onClick={onClick}
      />
    </Box>
  );
}

AnalysisShortcut.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AnalysisShortcut);
