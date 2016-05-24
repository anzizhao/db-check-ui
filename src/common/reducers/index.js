import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import dbcheck from './dbcheck';
import error from './error';
const rootReducer = combineReducers({
  dbcheck,
  error,
});


export default rootReducer;
