/**
 * app.js
 *
 * This is the entry file for the application
 */

// Needed for redux-saga es6 generator support
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Import all the third party stuff
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
// import history from 'utils/history';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
// Import i18n messages
import { translationMessages } from 'i18n';

// Import store and browserHistory
import { store, history } from 'configureStore';

// Import ThemeProvider
import { Grommet } from 'grommet';
import GlobalStyle from 'global-styles';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import theme from './theme';

const container = document.getElementById('app');
const root = createRoot(container);
const render = messages => {
  root.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <Router history={history}>
          <StyleSheetManager
            enableVendorPrefixes
            shouldForwardProp={(propName, target) => {
              if (typeof target === 'string') {
                // For HTML elements, forward the prop if it is a valid HTML attribute
                return isPropValid(propName);
              }
              // For other elements, forward all props
              return true;
            }}
          >
            <Grommet theme={theme}>
              <GlobalStyle />
              <App />
            </Grommet>
          </StyleSheetManager>
        </Router>
      </LanguageProvider>
    </Provider>,
  );
};

if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}
