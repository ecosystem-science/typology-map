import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Button, Box, Text } from 'grommet';
import { filter } from 'lodash/collection';
import { FOOTER } from 'containers/App/constants';
import { FormattedMessage } from 'react-intl';
import { PAGES } from 'config';

import { selectRouterPath } from 'containers/App/selectors';
import { navigatePage } from 'containers/App/actions';

import commonMessages from 'messages';

const Styled = styled.footer`
  position: relative;
  box-shadow: ${({ elevated }) =>
    elevated ? '0px -4px 8px rgba(0, 0, 0, 0.2)' : 'none'};
`;

// prettier-ignore
const FooterLink = styled(props => <Button {...props} plain />)`
  padding: ${({ theme }) => theme.global.edgeSize.small} ${({ theme }) => theme.global.edgeSize.medium};
  color: ${({ theme }) => theme.global.colors.white};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  background: transparent;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    text-decoration: underline;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    padding: ${({ theme }) => theme.global.edgeSize.small};
  }
`;

const FooterBar = styled.div`
  display: flex;
  padding: 0 ${({ theme }) => theme.global.edgeSize.medium};
  background: ${({ theme }) => theme.global.colors.footer.background};
`;

const NavFooter = styled(props => (
  <Box {...props} direction="row" gap="small" />
))``;

const pagesArray = Object.keys(PAGES).map(key => ({
  key,
  ...PAGES[key],
}));

function Footer({ navPage, path, elevated }) {
  const paths = path.split('/');
  const contentType = paths[0] === '' ? paths[1] : paths[0];
  const contentId =
    paths[0] === ''
      ? paths.length > 1 && paths[2]
      : paths.length > 0 && paths[1];
  const pagesFooter = filter(pagesArray, p => p.nav === FOOTER);
  return (
    <Styled elevated={elevated}>
      <FooterBar>
        <NavFooter justify="end">
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
        </NavFooter>
      </FooterBar>
    </Styled>
  );
}

Footer.propTypes = {
  navPage: PropTypes.func,
  path: PropTypes.string,
  elevated: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  path: state => selectRouterPath(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    navPage: id => dispatch(navigatePage(id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
