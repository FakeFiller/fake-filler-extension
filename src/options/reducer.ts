/// <reference path="../../index.d.ts" />

import { combineReducers, Reducer } from 'redux';

const optionsInitialState: IOptionsState = {
  isFetching: false,
  options: null,
};

const OptionsReducer: Reducer<IOptionsState> = (state = optionsInitialState, action) => {
  switch (action.type) {
    case 'FETCHING_OPTIONS':
      return Object.assign({}, state, {
        isFetching: true,
        options: {},
      });

    case 'RECEIVED_OPTIONS':
      return Object.assign({}, state, {
        isFetching: false,
        options: action.options,
      });

    default:
      return state;
  }
};

const shortcutsInitialState: IKeyboardShortcutsState = {
  isFetching: false,
  shortcuts: [],
};

const KeyboardShortcutsReducer: Reducer<IKeyboardShortcutsState> = (state = shortcutsInitialState, action) => {
  switch (action.type) {
    case 'FETCHING_KEYBOARD_SHORTCUTS':
      return Object.assign({}, state, {
        isFetching: true,
        shortcuts: [],
      });

    case 'RECEIVED_KEYBOARD_SHORTCUTS':
      return Object.assign({}, state, {
        isFetching: false,
        shortcuts: action.shortcuts,
      });

    default:
      return state;
  }
};

export default combineReducers<IAppState>({
  optionsData: OptionsReducer,
  keyboardShortcutsData: KeyboardShortcutsReducer,
});
