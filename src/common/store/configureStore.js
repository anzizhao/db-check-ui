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
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" preserveScrollTop={false} />
  </DockMonitor>
)


const stateTransformer = (state) => {
    let logger  
    let db = state
    let newItem = {}

    for(let key in db) {
        if( ! db.hasOwnProperty(key) ) {
            continue 
        }
        const item = db[key]
        if (Iterable.isIterable(item)){
            newItem[key] = item.toJS()
        } else {
            newItem[key] = db[key] 
        } 
    }
    logger = newItem 
    //todo 层
    db = state.todo 
    newItem = {}
    for(let key in db ) {
        if( ! db.hasOwnProperty(key) ) {
            continue 
        }
        const item = db[key]
        if (Iterable.isIterable(item)){
            newItem[key] = item.toJS()
        } else {
            newItem[key] = db[key] 
        } 
    }
    logger.todo = newItem  

    //todos 
    //db = logger.todo.todos 
    //newItem = {}
    //比较深的  特殊对待, 不是递归处理
    //newItem = db.map(todo =>{
        //return todo.toJS() 
    //})
    //logger.todo.todos = newItem 
    
    //todo process 
    return logger  
};




const middlewareBuilder = () => {

  let middleware = {};
  let universalMiddleware = [thunk,promiseMiddleware];
  let allComposeElements = [];
  
  if(process.browser){
    if(process.env.NODE_ENV === 'production'){
        console.log('configureStore, in the browser if ')
        middleware = applyMiddleware(...universalMiddleware);
        allComposeElements = [
            middleware,
            DevTools.instrument()
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
