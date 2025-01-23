import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Box, Button, Text } from 'grommet';
import { Next } from 'components/Icons';

import { navigate } from 'containers/App/actions';

import commonMessages from 'messages';
import messages from './messages';
// prettier-ignore
const Styled = styled(Box)``;

const StyledButton = styled(props => <Button plain {...props} />)`
  color: ${({ theme }) => theme.global.colors.black};
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.global.colors.brand};
  }
  &:focus {
    text-decoration: underline;
    color: ${({ theme }) => theme.global.colors.brand};
  }
`;

const TextActive = styled(Text)``;
const TextInactive = styled(props => <Text color="inactive" {...props} />)``;

function Breadcrumb({ targets, level, navExplore }) {
  return (
    <Styled direction="row" wrap align="center" gap="xsmall">
      <StyledButton
        onClick={() => navExplore()}
        label={<FormattedMessage {...messages.explore} />}
      />
      <Next color="inactive" />
      {level === 0 && (
        <TextActive>
          <FormattedMessage {...commonMessages.realm} />
        </TextActive>
      )}
      {level > 0 && targets && targets.length > 0 && (
        <StyledButton
          onClick={() => targets[0]()}
          label={<FormattedMessage {...commonMessages.realm} />}
        />
      )}
      <Next color="inactive" />
      {level < 1 && (
        <TextInactive>
          <FormattedMessage {...commonMessages.biome} />
        </TextInactive>
      )}
      {level === 1 && (
        <TextActive>
          <FormattedMessage {...commonMessages.biome} />
        </TextActive>
      )}
      {level > 1 && targets && targets.length > 1 && (
        <StyledButton
          onClick={() => targets[1]()}
          label={<FormattedMessage {...commonMessages.biome} />}
        />
      )}
      <Next color="inactive" />
      {level < 2 && (
        <TextInactive>
          <FormattedMessage {...commonMessages.group} />
        </TextInactive>
      )}
      {level === 2 && (
        <TextActive>
          <FormattedMessage {...commonMessages.group} />
        </TextActive>
      )}
    </Styled>
  );
}

Breadcrumb.propTypes = {
  level: PropTypes.number,
  targets: PropTypes.array,
  navExplore: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    navExplore: () => dispatch(navigate('explore')),
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(Breadcrumb);
