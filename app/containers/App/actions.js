/*
 * App Actions
 *
 * Actions change things in your application
 * Since this app uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { ROUTES } from 'config';

import {
  CHANGE_LOCALE,
  NAVIGATE,
  LOAD_CONFIG,
  CONFIG_REQUESTED,
  CONFIG_LOAD_SUCCESS,
  CONFIG_LOAD_ERROR,
  CONFIG_READY,
  QUERY_GROUPS,
  GROUPS_QUERIED,
  GROUPS_QUERY_SUCCESS,
  GROUPS_QUERY_ERROR,
  GROUPS_QUERY_READY,
  LOAD_CONTENT,
  CONTENT_REQUESTED,
  CONTENT_LOAD_SUCCESS,
  CONTENT_LOAD_ERROR,
  CONTENT_READY,
  DISMISS_DISCLAIMER,
  SET_FULLSCREEN_IMAGE,
  UPDATE_GROUPS_QUERY,
  RESET_GROUPS_QUERY,
  RESET_GROUPS_QUERY_NAV,
  SET_ACTIVE_GROUP_QUERY,
  SET_INFO_GROUP_QUERY,
  TOGGLE_DRAW,
  SHOW_QUERY_REGIONS,
  SET_QUERY_TYPE,
  SET_ANALYSE_PANEL,
} from './constants';

export function setLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    locale,
  };
}

/**
 * navigate to new location
 * @param {object || string} location new location { pathname, search } || pathname
 * @param {object} args navigation arguments { replace = true, deleteSearchParams = false}
 * @return {object} `{type: action id, location: new location, args: navigation arguments}`
 */
export function navigate(location, args) {
  return {
    type: NAVIGATE,
    location,
    args,
  };
}
/**
 * proxy action: navigate to new content page
 * @param {object} id new page id
 * @param {object} args navigation arguments { replace = true, deleteSearchParams = null}
 * @return {object} `{type: action id, location: new location, args: navigation arguments}`
 */
export function navigatePage(id, args) {
  return navigate(`${ROUTES.PAGE}/${id}`, args);
}
/**
 * proxy action: navigate to new typology object
 * @param {object} id
 * @param {object} args navigation arguments { replace = true, deleteSearchParams = false}
 * @return {object} `{type: action id, location: new location, args: navigation arguments}`
 */
export function navigateTypology(level, id, args) {
  return navigate(`${ROUTES.EXPLORE}/${level}/${id}`, args);
}
// proxy action: navigate home, optionally resetting all search params
export function navigateHome(reset = true) {
  return navigate(ROUTES.HOME, reset ? { deleteSearchParams: true } : {});
}

/**
 * Load the typology config data, this action starts the request saga
 *
 */
export function loadConfig(key) {
  return {
    type: LOAD_CONFIG,
    key,
  };
}

export function setConfigLoadSuccess(key, data, time) {
  return {
    type: CONFIG_LOAD_SUCCESS,
    data,
    key,
    time,
  };
}

export function setConfigRequested(key, time) {
  return {
    type: CONFIG_REQUESTED,
    key,
    time,
  };
}

export function setConfigLoadError(error, key) {
  return {
    type: CONFIG_LOAD_ERROR,
    error,
    key,
  };
}

export function setConfigReady(key, time) {
  return {
    type: CONFIG_READY,
    key,
    time,
  };
}
export function loadContent(contentType, key) {
  return {
    type: LOAD_CONTENT,
    key,
    contentType,
  };
}

export function setContentLoadSuccess(contentType, locale, key, data, time) {
  return {
    type: CONTENT_LOAD_SUCCESS,
    data,
    key,
    time,
    contentType,
    locale,
  };
}

export function setContentRequested(contentType, locale, key, time) {
  return {
    type: CONTENT_REQUESTED,
    key,
    time,
    contentType,
    locale,
  };
}

export function setContentLoadError(error, contentType, locale, key) {
  return {
    type: CONTENT_LOAD_ERROR,
    error,
    key,
    contentType,
    locale,
  };
}

export function setContentReady(contentType, key, locale, time) {
  return {
    type: CONTENT_READY,
    key,
    time,
    contentType,
    locale,
  };
}
export function setFullscreenImage(imageType, args) {
  return {
    type: SET_FULLSCREEN_IMAGE,
    imageType,
    args,
  };
}

export function dismissDisclaimer() {
  return {
    type: DISMISS_DISCLAIMER,
  };
}

export function queryGroups(args) {
  // console.log('queryGroups');
  return {
    type: QUERY_GROUPS,
    args,
  };
}

export function setGroupsQuerySuccess(layerType, groups, args, time) {
  return {
    type: GROUPS_QUERY_SUCCESS,
    layerType,
    groups,
    args,
    time,
  };
}

export function setGroupsQueried(layerType, time) {
  return {
    type: GROUPS_QUERIED,
    layerType,
    time,
  };
}

export function setGroupsQueryError(error, layerType, args) {
  return {
    type: GROUPS_QUERY_ERROR,
    error,
    layerType,
    args,
  };
}

export function setGroupQueryReady(layerType, time) {
  return {
    type: GROUPS_QUERY_READY,
    layerType,
    time,
  };
}

export function updateGroupsQuery(args) {
  return {
    type: UPDATE_GROUPS_QUERY,
    args,
  };
}

export function resetGroupsQuery() {
  return {
    type: RESET_GROUPS_QUERY,
  };
}
export function resetGroupsQueryNav() {
  return {
    type: RESET_GROUPS_QUERY_NAV,
  };
}
export function setActiveGroupQuery(id) {
  return {
    type: SET_ACTIVE_GROUP_QUERY,
    id,
  };
}
export function setInfoGroupQuery(id) {
  return {
    type: SET_INFO_GROUP_QUERY,
    id,
  };
}
export function toggleDraw(active) {
  return {
    type: TOGGLE_DRAW,
    active,
  };
}
export function showQueryRegions(active) {
  return {
    type: SHOW_QUERY_REGIONS,
    active,
  };
}
export function setQueryType(queryType) {
  return {
    type: SET_QUERY_TYPE,
    queryType,
  };
}
export function setAnalysePanelOpen(analysePanelOpen) {
  return {
    type: SET_ANALYSE_PANEL,
    analysePanelOpen,
  };
}
