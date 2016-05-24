import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import todo from './todo';
import dbcheck from './dbcheck';
import error from './error';

const rootReducer = combineReducers({
  //todo,
  dbcheck,
  error,

});


export default rootReducer;
