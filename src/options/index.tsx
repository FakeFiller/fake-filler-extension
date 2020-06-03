import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Route } from "react-router-dom";

import App from "src/options/components/App";
import Store from "src/options/store";

const optionsApp = (
  <Provider store={Store}>
    <HashRouter>
      <Route path="/" component={App} />
    </HashRouter>
  </Provider>
);

ReactDOM.render(optionsApp, document.getElementById("root"));
