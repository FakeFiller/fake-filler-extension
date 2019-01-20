/// <reference path="../../index.d.ts" />

import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';

import reducer from './reducer';

const Store = createStore(reducer, applyMiddleware(reduxThunk));

export default Store;
