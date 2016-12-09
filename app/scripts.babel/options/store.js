import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducer from './reducer';

const Store = createStore(reducer, applyMiddleware(reduxThunk));

export default Store;
