import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router";

import App from "src/options/components/App";
import Store from "src/options/store";
import { IFakeFillerOptions } from "src/types";

// Show options that arrive from another browser through sync while this page is open.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.options && changes.options.newValue) {
    Store.dispatch({ type: "RECEIVED_OPTIONS", options: changes.options.newValue as IFakeFillerOptions });
  }
});

const optionsApp = (
  <Provider store={Store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);

createRoot(document.getElementById("root") as HTMLElement).render(optionsApp);
