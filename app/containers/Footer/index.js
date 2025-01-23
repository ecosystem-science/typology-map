import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Button, Box, Text, ResponsiveContext } from 'grommet';
import { filter } from 'lodash/collection';
import { FOOTER } from 'containers/App/constants';
import { FormattedMessage } from 'react-intl';
import { PAGES } from 'config';

import { isMinSize } from 'utils/responsive';
import { selectRouterPath } from 'containers/App/selectors';
import { navigatePage } from 'containers/App/actions';
import { showCookieConsent } from 'containers/CookieConsent/actions';

import commonMessages from 'messages';
import messages from './messages';

const Styled = styled.footer`
  position: relative;
  box-shadow: ${({ elevated }) =>
    elevated ? '0px -4px 8px rgba(0, 0, 0, 0.2)' : 'none'};
`;

// prettier-ignore
const FooterLink = styled(p => <Button plain {...p} />)`
  padding:
    ${({ theme }) => theme.global.edgeSize.xxsmall}
    ${({ theme }) => theme.global.edgeSize.small};
  color: ${({ theme }) => theme.global.colors.white};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  background: transparent;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    text-decoration: underline;
  }
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    padding:
      ${({ theme }) => theme.global.edgeSize.small}
      ${({ theme }) => theme.global.edgeSize.medium};
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    padding: ${({ theme }) => theme.global.edgeSize.small};
  }
`;

const FooterBar = styled.div`
  display: flex;
  padding: 0 ${({ theme }) => theme.global.edgeSize.xsmall};
  background: ${({ theme }) => theme.global.colors.footer.background};
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    padding: 0 ${({ theme }) => theme.global.edgeSize.medium};
  }
`;

const NavFooter = styled(({ size, ...p }) => (
  <Box
    direction={isMinSize(size, 'medium') ? 'row' : 'column'}
    gap={isMinSize(size, 'medium') ? 'small' : 'hair'}
    {...p}
  />
))``;

const pagesArray = Object.keys(PAGES).map(key => ({
  key,
  ...PAGES[key],
}));

function Footer({ navPage, path, elevated, onShowCookieConsent }) {
  const paths = path.split('/');
  const contentType = paths[0] === '' ? paths[1] : paths[0];
  const contentId =
    paths[0] === ''
      ? paths.length > 1 && paths[2]
      : paths.length > 0 && paths[1];
  const pagesFooter = filter(pagesArray, p => p.nav === FOOTER);
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Styled elevated={elevated}>
          <FooterBar>
            <NavFooter justify="end" size={size}>
              {pagesFooter.map((p, index) => (
                <FooterLink
                  key={p.key}
                  onClick={() => navPage(p.key)}
                  label={
                    <Text size="small">
                      <FormattedMessage {...commonMessages[`page_${p.key}`]} />
                    </Text>
                  }
                  active={contentType === 'page' && contentId === p.key}
                  last={index === pagesFooter.length - 1}
                />
              ))}
              <FooterLink
                onClick={() => onShowCookieConsent()}
                label={
                  <Text size="small">
                    <FormattedMessage {...messages.linkCookieConsentUpdate} />
                  </Text>
                }
                last
              />
            </NavFooter>
          </FooterBar>
        </Styled>
      )}
    </ResponsiveContext.Consumer>
  );
}

Footer.propTypes = {
  navPage: PropTypes.func,
  onShowCookieConsent: PropTypes.func,
  path: PropTypes.string,
  elevated: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  path: state => selectRouterPath(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    navPage: id => dispatch(navigatePage(id)),
    onShowCookieConsent: () => dispatch(showCookieConsent(true)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
