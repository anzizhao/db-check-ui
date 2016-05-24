import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import todo from './todo';
import dbcheck from './dbcheck';
import error from './error';
import performance from './performance';

const rootReducer = combineReducers({
  //todo,
  dbcheck,
  error,
  performance
});


export default rootReducer;
