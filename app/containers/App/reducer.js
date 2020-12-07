/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { TYPOLOGY, PAGES } from 'config';
import { appLocales } from 'i18n';
import {
  TYPOLOGY_REQUESTED,
  TYPOLOGY_LOAD_SUCCESS,
  TYPOLOGY_LOAD_ERROR,
  GROUPS_QUERIED,
  GROUPS_QUERY_SUCCESS,
  GROUPS_QUERY_ERROR,
  CONTENT_REQUESTED,
  CONTENT_LOAD_SUCCESS,
  CONTENT_LOAD_ERROR,
  DISMISS_DISCLAIMER,
  SET_FULLSCREEN_IMAGE,
  RESET_GROUPS_QUERY,
  TOGGLE_DRAW,
  SHOW_QUERY_REGIONS,
  SET_QUERY_TYPE,
  SET_ANALYSE_PANEL,
} from './constants';

/* eslint-disable no-param-reassign */
const locales = appLocales.reduce((memo, locale) => {
  memo[locale] = null;
  return memo;
}, {});

const initialContent = {
  pages: Object.keys(PAGES).reduce((memo, key) => {
    memo[key] = Object.assign({}, locales);
    return memo;
  }, {}),
  realms: {},
  biomes: {},
  groups: {},
};

const initialGroupsByArea = {
  args: null,
  groups: {
    raster: null,
    vector: null,
  },
};

// The initial state of the App
export const initialState = {
  /* eslint-disable no-param-reassign */
  typologyConfig: Object.keys(TYPOLOGY).reduce((memo, key) => {
    memo[key] = null;
    return memo;
  }, {}),
  // record request time
  typologyConfigRequested: Object.keys(TYPOLOGY).reduce((memo, key) => {
    memo[key] = null;
    return memo;
  }, {}),
  // record return time
  typologyConfigReady: Object.keys(TYPOLOGY).reduce((memo, key) => {
    memo[key] = null;
    return memo;
  }, {}),
  // // record error time
  // typologyConfigError: TYPOLOGY.reduce((memo, resource, key) => {
  //   memo[key] = false;
  //   return memo;
  // }, {}),
  content: Object.assign({}, initialContent),
  // record request time
  contentRequested: Object.assign({}, initialContent),
  // record return time
  contentReady: Object.assign({}, initialContent),
  // // record error time
  // contentError: Object.assign({}, initialContent),
  showDisclaimer: false,
  fullscreenImage: null,
  groupsByArea: Object.assign({}, initialGroupsByArea),
  groupsByAreaQueried: Object.assign({}, initialGroupsByArea),
  groupsByAreaReady: Object.assign({}, initialGroupsByArea),
  drawActive: false,
  queryRegionsActive: false,
  queryType: null,
  analysePanelOpen: true,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case TYPOLOGY_REQUESTED:
        draft.typologyConfigRequested[action.key] = action.time;
        break;
      case TYPOLOGY_LOAD_SUCCESS:
        draft.typologyConfig[action.key] = action.data;
        draft.typologyConfigReady[action.key] = action.time;
        break;
      case TYPOLOGY_LOAD_ERROR:
        console.log('Error loading typology data... giving up!', action.key);
        draft.typologyConfigRequested[action.key] = action.time;
        break;
      case CONTENT_REQUESTED:
        if (draft.contentRequested[action.contentType])
          draft.contentRequested[action.contentType][action.key] = {
            [action.locale]: action.time,
          };
        break;
      case CONTENT_LOAD_SUCCESS:
        if (draft.content[action.contentType])
          draft.content[action.contentType][action.key] = {
            [action.locale]: action.data,
          };
        if (draft.contentReady[action.contentType])
          draft.contentReady[action.contentType][action.key] = {
            [action.locale]: action.time,
          };
        break;
      case CONTENT_LOAD_ERROR:
        console.log(
          'Error loading content ... giving up!',
          `${action.contentType}/${action.key}`,
        );
        if (draft.contentRequested[action.contentType])
          draft.contentRequested[action.contentType][action.key] = {
            [action.locale]: action.time,
          };
        break;
      case DISMISS_DISCLAIMER:
        draft.showDisclaimer = false;
        break;
      case SET_FULLSCREEN_IMAGE:
        // prettier-ignore
        draft.fullscreenImage =
          action.imageType && action.args
            ? {
              imageType: action.imageType,
              ...action.args,
            }
            : null;
        break;
      case RESET_GROUPS_QUERY:
        draft.groupsByArea = Object.assign({}, initialGroupsByArea);
        draft.groupsByAreaReady = Object.assign({}, initialGroupsByArea);
        draft.groupsByAreaQueried = Object.assign({}, initialGroupsByArea);
        break;
      // case QUERY_GROUPS:
      //   draft.groupsByAreaQueried = Object.assign({}, initialGroupsByArea);
      //   draft.groupsByAreaReady = Object.assign({}, initialGroupsByArea);
      //   break;
      case GROUPS_QUERIED:
        // reset results
        draft.groupsByArea = Object.assign({}, initialGroupsByArea);
        // record query begin
        draft.groupsByAreaQueried.groups[action.layerType] = action.time;
        break;
      case GROUPS_QUERY_SUCCESS:
        draft.groupsByArea.groups[action.layerType] = action.groups;
        draft.groupsByArea.args = action.args;
        draft.groupsByAreaReady.groups[action.layerType] = action.time;
        break;
      case GROUPS_QUERY_ERROR:
        console.log(
          'Error querying groups ... giving up!',
          `${action.layerType}`,
        );
        draft.groupsByAreaQueried.groups[action.layerType] = action.time;
        break;
      case TOGGLE_DRAW:
        draft.drawActive = action.active;
        break;
      case SHOW_QUERY_REGIONS:
        draft.queryRegionsActive = action.active;
        break;
      case SET_QUERY_TYPE:
        draft.queryType = action.queryType;
        break;
      case SET_ANALYSE_PANEL:
        draft.analysePanelOpen = action.analysePanelOpen;
        break;
    }
  });

export default appReducer;
