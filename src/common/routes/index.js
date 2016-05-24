import { Route, NotFoundRoute, DefaultRoute, IndexRoute} from "react-router";
import React from "react";

import App from "../containers/App";

import error404 from "../components/404";

export default (
    <Route name="app" 
        path="/" 
        component={App}
    >
    </Route>
);
