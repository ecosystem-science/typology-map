/**
 * Create the store with asynchronously loaded reducers
 */
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import appSaga from 'containers/App/saga';
import { createReduxHistory, routerMiddleware } from 'routerConfig';

// Create the store with two middlewares
// 1. sagaMiddleware: Makes redux-sagas work
// 2. routerMiddleware: Syncs the location/URL path to the state
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(
      sagaMiddleware,
      routerMiddleware,
    ),
  reducer: createReducer(),
  preloadedState: {},
  devTools: process.env.NODE_ENV !== 'production',
});

// Extensions
// Load app level sagas ( https://github.com/mxstbr/react-boilerplate/issues/1077 )
sagaMiddleware.run(appSaga, { history: createReduxHistory });
store.runSaga = sagaMiddleware.run;
store.injectedReducers = {}; // Reducer registry
store.injectedSagas = {}; // Saga registry

export const history = createReduxHistory(store);

// Make reducers hot reloadable, see http://mxs.is/googmo
if (module.hot) {
  module.hot.accept('./reducers', () => {
    store.replaceReducer(createReducer(store.injectedReducers));
  });
}
