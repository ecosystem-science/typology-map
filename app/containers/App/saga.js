import { takeEvery, takeLatest, select, put, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import extend from 'lodash/extend';
import Cookies from 'js-cookie';
import 'whatwg-fetch';
import 'url-search-params-polyfill';

import { TYPOLOGY, MAX_LOAD_ATTEMPTS, PATHS, PAGES } from 'config';

import { DEFAULT_LOCALE } from 'i18n';

import {
  LOAD_TYPOLOGY,
  LOAD_CONTENT,
  NAVIGATE,
  CHANGE_LOCALE,
  CHECK_COOKIECONSENT,
  COOKIECONSENT_NAME,
  SET_COOKIECONSENT,
  // COOKIECONSENT_CHECKED,
} from './constants';

import {
  selectLocale,
  selectRouterLocation,
  selectTypologyReadyByKey,
  selectTypologyRequestedByKey,
  selectContentReadyByKey,
  selectContentRequestedByKey,
} from './selectors';

import {
  setTypologyRequested,
  setTypologyLoadError,
  setTypologyLoadSuccess,
  setContentRequested,
  setContentLoadError,
  setContentLoadSuccess,
  cookieConsentChecked,
  checkCookieConsent,
} from './actions';

/**
 * Generator function. Function for restarting sagas multiple times before giving up and calling the error handler.
 * - following https://codeburst.io/try-again-more-redux-saga-patterns-bfbc3ffcdc
 *
 * @param {function} generator the saga generator to be restarted
 * @param {function} handleError the error handler after X unsuccessful tries
 * @param {integer} maxTries the maximum number of tries
 */
const autoRestart = (generator, handleError, maxTries = MAX_LOAD_ATTEMPTS) =>
  function* autoRestarting(...args) {
    let n = 0;
    while (n < maxTries) {
      n += 1;
      try {
        yield call(generator, ...args);
        break;
      } catch (err) {
        if (n >= maxTries) {
          yield handleError(err, ...args);
        }
      }
    }
  };

/**
 * Generator function. Load data error handler:
 * - Record load error
 *
 * @param {object} payload {key: data set key}
 */
function* loadDataErrorHandler(err, { key }) {
  yield put(setTypologyLoadError(err, key));
}
function* loadContentErrorHandler(err, { key, contentType, locale }) {
  yield put(setContentLoadError(err, contentType, locale, key));
}

export function* loadDataSaga({ key }) {
  if (TYPOLOGY[key]) {
    // requestedSelector returns the times that entities where fetched from the API
    const requestedAt = yield select(selectTypologyRequestedByKey, key);
    const ready = yield select(selectTypologyReadyByKey, key);
    // If haven't loaded yet, do so now.
    if (!requestedAt && !ready) {
      const url = `${PATHS.DATA}/${TYPOLOGY[key].path}`;
      try {
        // First record that we are requesting
        yield put(setTypologyRequested(key, Date.now()));
        const response = yield fetch(url);
        const responseOk = yield response.ok;
        if (responseOk && typeof response.json === 'function') {
          const json = yield response.json();
          if (json) {
            yield put(setTypologyLoadSuccess(key, json, Date.now()));
          } else {
            yield put(setTypologyRequested(key, false));
            throw new Error(response.statusText);
          }
        } else {
          yield put(setTypologyRequested(key, false));
          throw new Error(response.statusText);
        }
      } catch (err) {
        yield put(setTypologyRequested(key, false));
        // throw error
        throw new Error(err);
      }
    }
  }
}

// key expected to include full path, for at risk data metric/country
export function* loadContentSaga({ key, contentType }) {
  if (PAGES[key] || TYPOLOGY[contentType]) {
    const requestedAt = yield select(selectContentRequestedByKey, {
      contentType,
      key,
    });
    const ready = yield select(selectContentReadyByKey, {
      contentType,
      key,
    });
    // If haven't loaded yet, do so now.
    if (!requestedAt && !ready) {
      const currentLocale = yield select(selectLocale);
      let url;
      if (contentType === 'pages') {
        const page = PAGES[key];
        url = `${PATHS.CONTENT}/${currentLocale}/${page.path}/`;
      }
      if (TYPOLOGY[contentType]) {
        const typo = TYPOLOGY[contentType];
        url = `${PATHS.CONTENT}/${currentLocale}/${typo.contentPath}/${key}`;
      }
      if (url) {
        try {
          // First record that we are requesting
          yield put(
            setContentRequested(contentType, currentLocale, key, Date.now()),
          );
          const response = yield fetch(url);
          const responseOk = yield response.ok;
          if (responseOk && typeof response.text === 'function') {
            const responseBody = yield response.text();
            if (responseBody) {
              yield put(
                setContentLoadSuccess(
                  contentType,
                  currentLocale,
                  key,
                  responseBody,
                  Date.now(),
                ),
              );
            } else {
              yield put(
                setContentRequested(contentType, currentLocale, key, false),
              );
              throw new Error(response.statusText);
            }
          } else {
            yield put(
              setContentRequested(contentType, currentLocale, key, false),
            );
            throw new Error(response.statusText);
          }
        } catch (err) {
          // throw error
          yield put(
            setContentRequested(contentType, currentLocale, key, false),
          );
          throw new Error(err);
        }
      }
    }
  }
}

// location can either be string or object { pathname, search }
export function* navigateSaga({ location, args }) {
  const currentLocale = yield select(selectLocale);
  const currentLocation = yield select(selectRouterLocation);
  // default args
  const myArgs = extend(
    {
      needsLocale: currentLocale !== DEFAULT_LOCALE,
      replaceSearch: false, // if location search should fully replace previous
      deleteSearchParams: null, //  a list of specific search params to remove
    },
    args || {},
  );

  // 1. figure out path ========================
  // the new pathname
  let newPathname = '/';

  // if location is string
  // use as pathname and keep old search
  // note: location path is expected not to contain the locale
  if (typeof location === 'string') {
    newPathname += location;
  }

  // if location is object, use pathname and replace or extend search
  // location path is expected not to contain the locale
  else if (
    typeof location === 'object' &&
    typeof location.pathname !== 'undefined'
  ) {
    newPathname += location.pathname;
  }

  // keep old pathname
  else {
    newPathname += currentLocation.pathname;
  }
  // add locale
  const path = myArgs.needsLocale
    ? `/${currentLocale}${newPathname}`
    : newPathname;

  // 2. figure out new search params =================================
  let newSearchParams;
  // fully replace previous search
  if (
    typeof location === 'object' &&
    typeof location.search !== 'undefined' &&
    myArgs.replaceSearch
  ) {
    newSearchParams = new URLSearchParams(location.search);
  }
  // remove all search params
  else if (
    myArgs.deleteSearchParams &&
    !Array.isArray(myArgs.deleteSearchParams)
  ) {
    newSearchParams = new URLSearchParams('');
  }
  // keep or modify current search
  else {
    const currentSearchParams = new URLSearchParams(currentLocation.search);

    // remove some specific search params
    if (myArgs.deleteSearchParams && Array.isArray(myArgs.deleteSearchParams)) {
      newSearchParams = myArgs.deleteSearchParams.reduce(
        (updatedParams, param) => {
          // delete only specific value when key & value are present
          if (param.key) {
            if (param.value) {
              const params = new URLSearchParams();
              updatedParams.forEach((value, key) => {
                // only keep those that are not deleted
                if (param.key !== key || param.value !== value) {
                  params.append(key, value);
                }
              });
              return params;
            }
            updatedParams.delete(param.key);
          } else {
            updatedParams.delete(param);
          }
          return updatedParams;
        },
        currentSearchParams,
      );
    }
    // keep old params (for now)
    else {
      newSearchParams = currentSearchParams;
    }

    // merge params
    if (
      typeof location === 'object' &&
      typeof location.search !== 'undefined' &&
      !myArgs.replaceSearch
    ) {
      // adding new params to previous params
      const searchParams = new URLSearchParams(location.search);
      searchParams.forEach((value, key) => newSearchParams.set(key, value));
    }
  }
  // convert to string and append if necessary
  const newSearch = newSearchParams.toString();
  const search = newSearch.length > 0 ? `?${newSearch}` : '';

  // finally combine new path and search  ============================
  yield put(push(`${path}${search}`));
}

export function* changeLocaleSaga({ locale }) {
  const currentLocale = yield select(selectLocale);
  const currentLocation = yield select(selectRouterLocation);
  let path = '/';
  if (currentLocation.pathname) {
    // changing from default: add locale
    if (currentLocale === DEFAULT_LOCALE) {
      path = `/${locale}${currentLocation.pathname}`;
    }
    // changing to default: remove locale
    else if (locale === DEFAULT_LOCALE) {
      path = currentLocation.pathname.replace(`/${currentLocale}`, '');
    }
    // changing from non-default to other non-default
    else {
      path = currentLocation.pathname.replace(
        `/${currentLocale}`,
        `/${locale}`,
      );
    }
  }
  yield put(push(`${path}${currentLocation.search}`));
}

export function* checkCookieConsentSaga() {
  const consentStatus = Cookies.get(COOKIECONSENT_NAME);
  // console.log('Checking for cookie consent. Current status: ', consentStatus);
  yield put(cookieConsentChecked(consentStatus));
}
export function* setCookieConsentSaga({ status }) {
  Cookies.set(COOKIECONSENT_NAME, status, { expires: 365, sameSite: 'strict' });
  yield put(checkCookieConsent());
}

export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(
    LOAD_TYPOLOGY,
    autoRestart(loadDataSaga, loadDataErrorHandler, MAX_LOAD_ATTEMPTS),
  );
  yield takeEvery(
    LOAD_CONTENT,
    autoRestart(loadContentSaga, loadContentErrorHandler, MAX_LOAD_ATTEMPTS),
  );
  yield takeLatest(NAVIGATE, navigateSaga);
  yield takeLatest(CHANGE_LOCALE, changeLocaleSaga);
  yield takeEvery(CHECK_COOKIECONSENT, checkCookieConsentSaga);
  yield takeLatest(SET_COOKIECONSENT, setCookieConsentSaga);
}
