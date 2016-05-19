import 'babel-polyfill';


import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
//import { ReduxRouter } from 'redux-router';

import { syncHistoryWithStore, routerReducer } from 'react-router-redux'


import configureStore from '../common/store/configureStore';
import routes from '../common/routes';
import {render} from 'react-dom';

import "../../styles/index.css";

import { browserHistory } from 'react-router'


//加载完成
NProgress.done();


//Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();
//threee url strategy
//const history = createHashHistory();
const history = browserHistory;
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);

//if (process.env.NODE_ENV !== 'production') {
    //require('../server/devtools')(store);
//}
    //<Provider store={store}>
        //<ReduxRouter>
            //<Router children={routes} history={history} />
        //</ReduxRouter>
    //</Provider>

render(
    <Provider store={store}>
        <Router children={routes} history={ browserHistory } />
    </Provider>
        ,
    document.getElementById('root')
);

