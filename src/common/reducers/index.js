import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import dbcheck from './dbcheck';
import error from './error';

import performance from './performance';

const rootReducer = combineReducers({
  dbcheck,
  error,
  performance
});


export default rootReducer;
