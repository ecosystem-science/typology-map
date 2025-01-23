/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Routes, Route } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import { useInjectReducer } from 'utils/injectReducer';

import reducer from 'containers/App/reducer';

import {
  loadConfig,
  dismissDisclaimer,
  navigatePage,
} from 'containers/App/actions';
import {
  selectActiveGroup,
  selectShowDisclaimer,
  selectRouterPathNamed,
  selectFullscreenImage,
} from 'containers/App/selectors';

import RouteHome from 'containers/RouteHome/Loadable';
import RoutePage from 'containers/RoutePage/Loadable';
import RouteExploreOverview from 'containers/RouteExploreOverview/Loadable';
import RouteExplore from 'containers/RouteExplore';
import RouteAnalyse from 'containers/RouteAnalyse';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import MapContainer from 'containers/MapContainer';
import Header from 'containers/Header';
import FullscreenImage from 'containers/FullscreenImage';
import Disclaimer from 'components/Disclaimer';
import CookieConsent from 'containers/CookieConsent';

import { getHeaderHeight } from 'utils/responsive';

import { ROUTES, PAGES } from 'config';

import commonMessages from 'messages';

const AppWrapper = styled.div`
  width: 100%;
  min-height: 100%;
`;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: ${getHeaderHeight('small')}px;
  @media (min-width: ${props => props.theme.sizes.medium.minpx}) {
    padding-top: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${props => props.theme.sizes.large.minpx}) {
    padding-top: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${props => props.theme.sizes.xlarge.minpx}) {
    padding-top: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${props => props.theme.sizes.xxlarge.minpx}) {
    padding-top: ${getHeaderHeight('xxlarge')}px;
  }
`;

function App({
  onLoadTypology,
  showDisclaimer,
  onDismissDisclaimer,
  onNavigateAbout,
  fullscreenImage,
  path,
  intl,
  activeGroup,
}) {
  useInjectReducer({ key: 'global', reducer });

  // kick off loading of typology configuration files
  useEffect(() => {
    onLoadTypology();
  }, []);

  let groupId;
  if (path.route === ROUTES.EXPLORE && path.level === 'groups') {
    groupId = path.id;
  } else if (path.route === ROUTES.ANALYSE && activeGroup) {
    groupId = activeGroup;
  }

  return (
    <AppWrapper>
      <Helmet
        titleTemplate={`%s - ${intl.formatMessage(commonMessages.appTitle)}`}
        defaultTitle={intl.formatMessage(commonMessages.appTitle)}
      >
        <meta
          name="description"
          content={intl.formatMessage(commonMessages.metaDescription)}
        />
      </Helmet>
      <CookieConsent />
      {showDisclaimer && (
        <Disclaimer
          onDismiss={() => onDismissDisclaimer()}
          onMore={() => onNavigateAbout()}
        />
      )}
      <Header />
      <Content>
        <MapContainer
          groupId={groupId}
          expandWithAside={path.route === ROUTES.ANALYSE}
          mode={path.route}
        />
        <Routes>
          <Route
            path={`/:locale?/${ROUTES.HOME}`}
            element={<RouteHome />}
          />
          <Route
            path={`/:locale?/${ROUTES.EXPLORE}`}
            element={<RouteExploreOverview />}
          />
          <Route
            path={`/:locale?/${ROUTES.EXPLORE}/:level/:id`}
            element={<RouteExplore />}
          />
          <Route
            path={`/:locale?/${ROUTES.ANALYSE}`}
            element={<RouteAnalyse />}
          />
          <Route
            path={`/:locale?/${ROUTES.PAGE}/:id`}
            element={<RoutePage />}
          />
          <Route path="" element={<NotFoundPage />} />
        </Routes>
        {fullscreenImage && <FullscreenImage config={fullscreenImage} />}
      </Content>
    </AppWrapper>
  );
}

// App.propTypes = {
//   intl: PropTypes.object.isRequired,
// };

// export default injectIntl(App);
// export default App;

App.propTypes = {
  onLoadTypology: PropTypes.func,
  onDismissDisclaimer: PropTypes.func,
  onNavigateAbout: PropTypes.func,
  showDisclaimer: PropTypes.bool,
  path: PropTypes.object,
  fullscreenImage: PropTypes.object,
  intl: PropTypes.object.isRequired,
  activeGroup: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  showDisclaimer: state => selectShowDisclaimer(state),
  path: state => selectRouterPathNamed(state),
  fullscreenImage: state => selectFullscreenImage(state),
  activeGroup: state => selectActiveGroup(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onLoadTypology: () => {
      dispatch(loadConfig('realms'));
      dispatch(loadConfig('biomes'));
      dispatch(loadConfig('groups'));
      // dispatch(loadConfig('faqs'));
    },
    onDismissDisclaimer: () => dispatch(dismissDisclaimer()),
    onNavigateAbout: () => dispatch(navigatePage(PAGES.about.path)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(App));
