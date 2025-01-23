import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

export const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
  });
