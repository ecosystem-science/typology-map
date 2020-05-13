/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
// import {} from './constants';

// The initial state of the App
export const initialState = {
  state: 0,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case 'state':
        draft.state = 1;
        break;
    }
  });

export default appReducer;
