import { Route, NotFoundRoute, DefaultRoute, IndexRoute} from "react-router";
import React from "react";

import Todo from "../containers/App";

import error404 from "../components/404";

      //<IndexRoute  
          //component={Todo} 
      ///>
export default (
    <Route name="app" 
        path="/" 
        component={Todo}
    >
    </Route>
);
