import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import todo from './todo';

const rootReducer = combineReducers({
  router : routerStateReducer,
  todo,
});

export default rootReducer;
