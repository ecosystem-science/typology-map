/**
 *
 * RouteExploreOverview
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { selectRealmsWithStats, selectLocale } from 'containers/App/selectors';
import { navigateTypology } from 'containers/App/actions';
// import messages from './messages';

import SectionExplore from 'containers/RouteHome/SectionExplore';
import Footer from 'containers/Footer';

import messages from './messages';

const Styled = styled.div`
  min-height: 100vh;
  position: relative;
  z-index: 2;
`;

export function RouteExploreOverview({ realms, navRealm, locale, intl }) {
  return (
    <Styled>
      <Helmet>
        <title>{intl.formatMessage(messages.metaTitle)}</title>
        <meta
          name="description"
          content={intl.formatMessage(messages.metaDescription)}
        />
      </Helmet>
      <SectionExplore
        realms={realms}
        navRealm={navRealm}
        locale={locale}
        title={intl.formatMessage(messages.title)}
        teaser={intl.formatMessage(messages.teaser)}
      />
      <Footer />
    </Styled>
  );
}

RouteExploreOverview.propTypes = {
  realms: PropTypes.array,
  navRealm: PropTypes.func,
  locale: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  realms: state => selectRealmsWithStats(state),
  locale: state => selectLocale(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    navRealm: id => dispatch(navigateTypology('realms', id)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(RouteExploreOverview));
