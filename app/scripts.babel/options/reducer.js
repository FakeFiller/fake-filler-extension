import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AppConstants from './constants';

const initialState = {};

const OptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case AppConstants.FETCHING_OPTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        options: {},
      });

    case AppConstants.RECEIVED_OPTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        options: action.options,
      });

    default:
      return state;
  }
};

const KeyboardShortcutsReducer = (state = [], action) => {
  switch (action.type) {
    case AppConstants.FETCHING_KEYBOARD_SHORTCUTS:
      return Object.assign({}, state, {
        isFetching: true,
        shortcuts: [],
      });

    case AppConstants.RECEIVED_KEYBOARD_SHORTCUTS:
      return Object.assign({}, state, {
        isFetching: false,
        shortcuts: action.shortcuts,
      });

    default:
      return state;
  }
};

export default combineReducers({
  form: formReducer,
  OptionsReducer,
  KeyboardShortcutsReducer,
});
