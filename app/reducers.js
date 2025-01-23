/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */
import { combineReducers } from 'redux';

// import globalReducer from 'containers/App/reducer';
import { routerReducer } from 'routerConfig';

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers = {}) {
  // router reducer is static, pass it in when adding asyncReducers
  return combineReducers({
    router: routerReducer,
    ...asyncReducers,
  });
}
