import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import todo from './todo';
import dbcheck from './dbcheck';

const rootReducer = combineReducers({
  //router : routerStateReducer,
  todo,
  dbcheck
});

export default rootReducer;
