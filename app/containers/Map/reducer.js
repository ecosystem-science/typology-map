/*
 *
 * Map reducer
 *
 */
import { produce } from 'immer';

import { GROUP_LAYER_OPTIONS } from 'config';

import {
  LAYER_REQUESTED,
  LAYER_LOAD_SUCCESS,
  LAYER_LOAD_ERROR,
  SET_OPACITY,
  SET_BASEMAP,
  SET_COUNTRY, // bool
  SET_ZOOM_TO_BOUNDS, // bool
  SET_REGION_HIGHLIGHT,
} from './constants';

export const initialState = {
  layers: {},
  layersRequested: {},
  layersReady: {},
  basemap: 'light',
  country: false,
  opacity: GROUP_LAYER_OPTIONS.opacity,
  zoomToBounds: true,
  regionHighlightId: null,
};

const mapReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_BASEMAP:
        draft.basemap = action.value;
        break;
      case SET_OPACITY:
        draft.opacity = parseFloat(action.value);
        break;
      case SET_COUNTRY:
        draft.country = action.value; // bool
        break;
      case SET_ZOOM_TO_BOUNDS:
        draft.zoomToBounds = action.value; // bool
        break;
      case SET_REGION_HIGHLIGHT:
        draft.regionHighlightId = action.id; // bool
        break;
      case LAYER_REQUESTED:
        draft.layersRequested[action.key] = action.time;
        break;
      case LAYER_LOAD_SUCCESS:
        draft.layers[action.key] = {
          config: action.config,
          data: action.data,
        };
        draft.layersReady[action.key] = action.time;
        break;
      case LAYER_LOAD_ERROR:
        // console.log('Error loading layer data... giving up!', action.key);
        draft.layersRequested[action.key] = action.time;
        break;
    }
  });

export default mapReducer;
