import { configureStore } from "@reduxjs/toolkit";

import reducers from "src/options/reducer";

// configureStore includes the thunk middleware the option actions rely on.
const Store = configureStore({ reducer: reducers });

export default Store;
