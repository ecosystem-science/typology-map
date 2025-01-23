import {
  takeEvery,
  takeLatest,
  select,
  put,
  call,
  fork,
} from 'redux-saga/effects';
import { push } from 'redux-first-history';
import extend from 'lodash/extend';
import 'whatwg-fetch';
import 'url-search-params-polyfill';


import {
  CONFIG,
  MAX_LOAD_ATTEMPTS,
  PATHS,
  PAGES,
  MAX_LOAD_ATTEMPTS_GROUPS,
} from 'config';

import { DEFAULT_LOCALE } from 'i18n';
import { areaToPolygonWKT } from 'containers/Map/utils';
import { startsWith } from 'utils/string';

import {
  LOAD_CONFIG,
  LOAD_CONTENT,
  QUERY_GROUPS,
  NAVIGATE,
  CHANGE_LOCALE,
  UPDATE_GROUPS_QUERY,
  RESET_GROUPS_QUERY_NAV,
  SET_ACTIVE_GROUP_QUERY,
  SET_INFO_GROUP_QUERY,
  // COOKIECONSENT_CHECKED,
} from './constants';

import {
  selectLocale,
  selectRouterLocation,
  selectConfigReadyByKey,
  selectConfigRequestedByKey,
  selectContentReadyByKey,
  selectContentRequestedByKey,
  selectGroupsQueryReadyByType,
  selectGroupsQueriedByType,
  selectGroupsByAreaArgs,
  selectRealmForBiome,
  selectGroupsByArea,
  selectGroups,
  selectBiomes,
} from './selectors';

import {
  setConfigRequested,
  setConfigLoadError,
  setConfigLoadSuccess,
  setContentRequested,
  setContentLoadError,
  setContentLoadSuccess,
  setGroupsQueried,
  setGroupsQueryError,
  setGroupsQuerySuccess,
  resetGroupsQuery,
} from './actions';

const cleanSearch = search =>
  Object.keys(search).reduce((memo, param) => {
    if (search[param] !== '' && search[param] !== null) {
      return { ...memo, [param]: search[param] };
    }
    return memo;
  }, {});

// location can either be string or object { pathname, search }
function* navigateSaga({ location, args }) {
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
    if (startsWith(location, '/')) {
      newPathname = location;
    } else {
      newPathname += location;
    }
  }

  // if location is object, use pathname and replace or extend search
  // location path is expected not to contain the locale
  else if (
    typeof location === 'object' &&
    typeof location.pathname !== 'undefined'
  ) {
    if (startsWith(location.pathname, '/')) {
      newPathname = location.pathname;
    } else {
      newPathname += location.pathname;
    }
  }

  // keep old pathname
  else {
    newPathname = currentLocation.pathname;
  }
  // add locale
  const path = (myArgs.needsLocale && !startsWith(newPathname, `/${currentLocale}`))
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
    newSearchParams = new URLSearchParams(cleanSearch(location.search));
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
      const searchParams = new URLSearchParams(cleanSearch(location.search));
      searchParams.forEach((value, key) => newSearchParams.set(key, value));
    }
  }
  // convert to string and append if necessary
  const newSearch = newSearchParams.toString();
  const search = newSearch.length > 0 ? `?${newSearch}` : '';

  // finally combine new path and search  ============================
  if (newPathname !== currentLocation.pathname) {
    window.scrollTo(0, 0);
  }
  yield put(push(`${path}${search}`));
}

function* changeLocaleSaga({ locale }) {
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

function* updateGroupsQuerySaga({ args }) {
  const { keep, remove } = Object.keys(args).reduce(
    (memo, arg) => {
      const mk = memo.keep;
      const mr = memo.remove;
      const value = args[arg];
      if (value && value !== '') {
        return {
          remove: mr,
          keep: {
            ...mk,
            [arg]: value,
          },
        };
      }
      return {
        keep: mk,
        remove: [...mr, arg],
      };
    },
    { keep: {}, remove: [] },
  );
  yield call(navigateSaga, {
    location: { search: keep },
    args: { deleteSearchParams: remove },
  });
}
function* setActiveGroupQuerySaga({ id }) {
  if (id === '') {
    yield call(navigateSaga, {
      args: { deleteSearchParams: ['active'] },
    });
  } else {
    yield call(navigateSaga, {
      location: { search: { active: id } },
    });
  }
}
function* setInfoGroupQuerySaga({ id }) {
  if (id === '') {
    yield call(navigateSaga, {
      args: { deleteSearchParams: ['info'] },
    });
  } else {
    yield call(navigateSaga, {
      location: { search: { info: id } },
    });
  }
}
function* resetGroupsQuerySaga() {
  yield call(navigateSaga, {
    args: {
      deleteSearchParams: [
        'area',
        'realm',
        'biome',
        'occurrence',
        'active',
        'regionId',
      ],
    },
  });
}

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
  yield put(setConfigLoadError(err, key));
}
function* loadContentErrorHandler(err, { key, contentType, locale }) {
  yield put(setContentLoadError(err, contentType, locale, key));
}
function* queryGroupsErrorHandler(err, { layerType, args }) {
  yield put(setGroupsQueryError(err, layerType, args));
}

function* loadConfigSaga({ key }) {
  if (CONFIG[key]) {
    // requestedSelector returns the times that entities where fetched from the API
    const requestedAt = yield select(selectConfigRequestedByKey, key);
    const ready = yield select(selectConfigReadyByKey, key);

    // If haven't loaded yet, do so now.
    if (!requestedAt && !ready) {
      const url = `${PATHS.DATA}/${CONFIG[key].path}`;
      try {
        // First record that we are requesting
        yield put(setConfigRequested(key, Date.now()));
        const response = yield fetch(url);

        const responseOk = yield response.ok;
        if (responseOk && typeof response.json === 'function') {
          const json = yield response.json();
          if (json) {
            yield put(setConfigLoadSuccess(key, json, Date.now()));
          } else {
            yield put(setConfigRequested(key, false));
            throw new Error(response.statusText);
          }
        } else {
          yield put(setConfigRequested(key, false));
          throw new Error(response.statusText);
        }
      } catch (err) {
        console.log('error loading config/data: ', key, err);
        yield put(setConfigRequested(key, false));
        // throw error
        throw new Error(err);
      }
    }
  }
}

// key expected to include full path, for at risk data metric/country
function* loadContentSaga({ key, contentType }) {
  if (PAGES[key] || CONFIG[contentType]) {
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
      if (CONFIG[contentType]) {
        const typo = CONFIG[contentType];
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
          console.log('error loading content: ', key, err);
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

function* queryGroupsByType(type, args) {
  // console.log('queryGroupsByType', type, args)
  const { area, regionId, occurrence, realm, biome } = args;
  const polygonWKT = areaToPolygonWKT(area);
  // requestedSelector returns the times that entities where fetched from the API
  const requestedAt = yield select(selectGroupsQueriedByType, type);
  const ready = yield select(selectGroupsQueryReadyByType, type);
  // If haven't loaded yet, do so now.
  if (!requestedAt && !ready) {
    let url = `${PATHS.GROUPS_QUERY_API[type]}`;
    if (polygonWKT !== '') {
      url = `${url}?poly=${polygonWKT}`;
    } else {
      url = `${url}?regionid=${regionId}`;
    }
    if (occurrence) {
      url = `${url}&occurrence=${occurrence}`;
    }
    if (biome) {
      url = `${url}&biome=${biome}`;
    } else if (realm) {
      url = `${url}&realm=${realm}`;
    }
    try {
      // First record that we are requesting
      yield put(setGroupsQueried(type, Date.now()));
      const response = yield fetch(url);
      const responseOk = yield response.ok;
      if (responseOk && typeof response.json === 'function') {
        const json = yield response.json();
        if (json) {
          yield put(setGroupsQuerySuccess(type, json, args, Date.now()));
        } else {
          yield put(setGroupsQueried(type, false));
          throw new Error(response.statusText);
        }
      } else {
        yield put(setGroupsQueried(type, false));
        throw new Error(response.statusText);
      }
    } catch (err) {
      yield put(setGroupsQueried(type, false));
      // throw error
      throw new Error(err);
    }
  }
}
//  pretend we are querying but actually filter results from previous query
function* filterGroupsByType(type, args) {
  const groupsByArea = yield select(selectGroupsByArea);
  const groupsForType = groupsByArea.groups[type];
  const groups = yield select(selectGroups);
  const biomes = yield select(selectBiomes);
  const { realm, biome } = args;
  const groupIds = groupsForType.filter(gId => {
    const group = groups.find(g => g.id === gId.layer_id);
    if (biome && group.biome !== biome) {
      return false;
    }
    const theBiome =
      group.biome && biomes && biomes.find(b => b.id === group.biome);
    if (realm && theBiome.realm !== realm) {
      return false;
    }
    return true;
  });
  yield put(setGroupsQueried(type, Date.now()));
  yield put(setGroupsQuerySuccess(type, groupIds, args, Date.now()));
}

const needsQuery = (args, argsStored) => {
  if (!argsStored) return true;
  const { area, occurrence, realm, biome, regionId } = args;
  const areaS = argsStored.area;
  const regionIdS = argsStored.regionId;
  const occurrenceS = argsStored.occurrence;
  const realmS = argsStored.realm;
  const biomeS = argsStored.biome;
  // conditions for not needing to query again
  if (
    // 1. areas or regions need to remain unchanged
    ((area && area === areaS) || (regionId && regionId === regionIdS)) &&
    // 2. occurrence needs to be the same or not ever set
    (occurrence === occurrenceS || (!occurrenceS && !occurrence))
  ) {
    // nothing set previously
    if (!realmS && !biomeS) {
      return false;
    }
    // realm prev set and unchanged
    if (realmS && !biomeS && realm === realmS) {
      return false;
    }
    // realm prev set and biome belongs to that realm
    if (realmS && !biomeS && biome) {
      const biomeRealm = select(selectRealmForBiome, biome);
      if (biomeRealm.id === realmS) {
        return false;
      }
    }
    // biome prev set and unchanged
    if (biomeS && biome === biomeS) {
      return false;
    }
    return true;
  }
  return true;
};

function* queryGroupsSaga({ args }) {
  const argsStored = yield select(selectGroupsByAreaArgs);
  if (needsQuery(args, argsStored)) {
    yield put(resetGroupsQuery());
    if (args.regionId) {
      yield queryGroupsByType('areasbyregion', args);
    } else {
      yield fork(queryGroupsByType, 'vector', args);
      yield fork(queryGroupsByType, 'raster', args);
    }
  } else if (args.regionId) {
    yield filterGroupsByType('areasbyregion', args);
  } else {
    yield fork(filterGroupsByType, 'vector', args);
    yield fork(filterGroupsByType, 'raster', args);
  }
}

export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(
    LOAD_CONFIG,
    autoRestart(loadConfigSaga, loadDataErrorHandler, MAX_LOAD_ATTEMPTS),
  );
  yield takeEvery(
    LOAD_CONTENT,
    autoRestart(loadContentSaga, loadContentErrorHandler, MAX_LOAD_ATTEMPTS),
  );
  yield takeLatest(
    QUERY_GROUPS,
    autoRestart(
      queryGroupsSaga,
      queryGroupsErrorHandler,
      MAX_LOAD_ATTEMPTS_GROUPS,
    ),
  );
  yield takeLatest(NAVIGATE, navigateSaga);
  yield takeLatest(CHANGE_LOCALE, changeLocaleSaga);
  yield takeLatest(UPDATE_GROUPS_QUERY, updateGroupsQuerySaga);
  yield takeLatest(RESET_GROUPS_QUERY_NAV, resetGroupsQuerySaga);
  yield takeLatest(SET_ACTIVE_GROUP_QUERY, setActiveGroupQuerySaga);
  yield takeLatest(SET_INFO_GROUP_QUERY, setInfoGroupQuerySaga);
}
