import { createStore, applyMiddleware, compose } from 'redux';
//import { createDevTools } from 'redux-devtools';
//



import React from 'react';
//import { reduxReactRouter } from 'redux-router';
import thunk from 'redux-thunk';
import createHistory from 'history/lib/createBrowserHistory';
import createLogger from 'redux-logger';
import promiseMiddleware from '../api/promiseMiddleware';

import rootReducer from '../reducers';

import {Iterable} from 'immutable';

import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'


const DevTools = createDevTools(
    <DockMonitor 
        toggleVisibilityKey="ctrl-h" 
        changePositionKey="ctrl-q"
    >
        <LogMonitor  />
    </DockMonitor>
)


const stateTransformer = (state) => {
    const newState = {};
    for (let i of Object.keys(state)) {
        if ( Iterable.isIterable(state[i])) {
            newState[i] = state[i].toJS();
        } else {
            newState[i] = state[i];
        }
    }
    // 具体区域, 自己保证各种情况不报错
    //such as below , 
    // 这里的toJS 修改原来的字段问题 
    try{
        let dbCheck  
        let tmp = newState.dbcheck.db 
        if( tmp.reports ) {
            dbCheck = {
                db: {
                    reports: tmp.reports.toJS()  
                } 
            }
            newState.dbCheck = dbCheck 
        }
    } catch (e) {
        console.error( e ) 
        return newState;
    } 
    //finally {
    //}
    return newState;
};




const middlewareBuilder = () => {

  let middleware = {};
  let universalMiddleware = [thunk, promiseMiddleware];
  let allComposeElements = [];
  
  if(process.browser){
    if(process.env.NODE_ENV === 'production'){
        console.log('configureStore, in the browser if ')
        middleware = applyMiddleware(...universalMiddleware);
        allComposeElements = [
            middleware,
        ]
    }else{
        console.log('configureStore, in the browser else ')
        const logger = createLogger({
            stateTransformer,
        });
        middleware = applyMiddleware(...universalMiddleware, logger  );
        allComposeElements = [
            middleware,
            DevTools.instrument()
        ]
    }
  }else{
    console.log('configureStore, in the else branch')
    middleware = applyMiddleware(...universalMiddleware);
    allComposeElements = [
      middleware
    ]
  }

  return allComposeElements;

}

const finalCreateStore = compose(...middlewareBuilder())(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
