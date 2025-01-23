import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Box, Layer, Paragraph, Heading } from 'grommet';
import { navigatePage } from 'containers/App/actions';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { PAGES } from 'config';

import ButtonPrimary from 'components/ButtonPrimary';
import ButtonText from 'components/ButtonText';

import { checkCookieConsent, setCookieConsent } from './actions';
import {
  selectCookieConsent,
  selectCookieConsentApp,
  selectCookieConsentChecked,
  selectCookieConsentShow,
} from './selectors';

import saga from './saga';
import reducer from './reducer';

import messages from './messages';

const Styled = styled.div``;
const StyledButtonText = styled(ButtonText)`
  color: ${({ theme }) => theme.global.colors.brand};
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

// prettier-ignore
const StyledButton = styled(ButtonPrimary)`
  padding: 5px 10px;
  background: ${({ theme, secondary }) =>
    theme.global.colors[secondary ? 'light-grey' : 'brand-2']};
  color: ${({ theme, secondary }) =>
    theme.global.colors[secondary ? 'dark-grey' : 'white']};
  &:hover {
    background: ${({ theme, secondary }) =>
    theme.global.colors[secondary ? 'light-grey' : 'black']};
    color: ${({ theme, secondary }) =>
    theme.global.colors[secondary ? 'black' : 'white']};
  }
`;

const ButtonWrap = styled(Box)`
  text-align: center;
  margin-right: auto;
  margin-left: auto;
`;

export function CookieConsent({
  init,
  cookieConsent,
  cookieConsentApp,
  onConsent,
  checked,
  nav,
  show,
}) {
  useInjectSaga({ key: 'consent', saga });
  useInjectReducer({ key: 'consent', reducer });
  useEffect(() => {
    init();
  }, []);

  const consentUnset =
    cookieConsent !== 'true' &&
    cookieConsent !== 'false' &&
    cookieConsentApp !== 'true' &&
    cookieConsentApp !== 'false';
  // console.log('Show cookie consent dialogue: ', checked && consentUnset);
  // console.log('Cookie consent cookie status: ', cookieConsent);
  // console.log('Cookie consent app status: ', cookieConsentApp);
  // console.log('Cookie consent checked: ', checked);

  return (
    <Styled>
      {(show || (checked && consentUnset)) && (
        <Layer
          position="bottom-right"
          plain
          responsive={false}
          modal={false}
          animate={false}
          margin="small"
        >
          <Box
            pad={{ vertical: 'small', horizontal: 'medium' }}
            background="white"
            style={{ maxWidth: '100%', width: '360px' }}
            elevation="large"
          >
            <Heading level={3} margin={{ bottom: 'small' }}>
              <FormattedMessage {...messages.title} />
            </Heading>
            <Paragraph margin={{ bottom: 'medium' }} size="medium">
              <FormattedMessage {...messages.info} />
            </Paragraph>
            <ButtonWrap gap="xsmall" margin={{ bottom: 'medium' }}>
              <StyledButton
                onClick={() => {
                  onConsent('true');
                }}
              >
                <FormattedMessage {...messages.buttonAccept} />
              </StyledButton>
              <StyledButton
                secondary
                onClick={() => {
                  onConsent('false');
                }}
              >
                <FormattedMessage {...messages.buttonReject} />
              </StyledButton>
            </ButtonWrap>
            <Box direction="row" justify="between">
              <StyledButtonText
                onClick={() => nav('privacy')}
                label={<FormattedMessage {...messages.linkPrivacyPolicy} />}
              />
              <StyledButtonText
                onClick={() => nav('terms')}
                label={<FormattedMessage {...messages.linkTerms} />}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </Styled>
  );
}

CookieConsent.propTypes = {
  init: PropTypes.func,
  onConsent: PropTypes.func,
  nav: PropTypes.func,
  cookieConsent: PropTypes.string,
  cookieConsentApp: PropTypes.string,
  checked: PropTypes.bool,
  show: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  cookieConsent: state => selectCookieConsent(state),
  cookieConsentApp: state => selectCookieConsentApp(state),
  checked: state => selectCookieConsentChecked(state),
  show: state => selectCookieConsentShow(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    init: () => dispatch(checkCookieConsent()),
    onConsent: status => dispatch(setCookieConsent(status)),
    nav: page => dispatch(navigatePage(PAGES[page].path)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(CookieConsent));
