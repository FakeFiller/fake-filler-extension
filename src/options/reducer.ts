/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { combineReducers, Reducer } from "redux";

import { MyActions } from "src/options/actions";
import { IOptionsState, IKeyboardShortcutsState, IAppState, IAuthState } from "src/types";

const optionsInitialState: IOptionsState = {
  isFetching: false,
  options: null,
};

const OptionsReducer: Reducer<IOptionsState> = (state = optionsInitialState, action: MyActions) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "FETCHING_OPTIONS":
        draft.isFetching = true;
        draft.options = null;
        return draft;

      case "RECEIVED_OPTIONS":
        draft.isFetching = false;
        draft.options = action.options;
        return draft;

      default:
        return state;
    }
  });
};

const shortcutsInitialState: IKeyboardShortcutsState = {
  isFetching: false,
  shortcuts: [],
};

const KeyboardShortcutsReducer: Reducer<IKeyboardShortcutsState> = (
  state = shortcutsInitialState,
  action: MyActions
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "FETCHING_KEYBOARD_SHORTCUTS":
        draft.isFetching = true;
        draft.shortcuts = [];
        return draft;

      case "RECEIVED_KEYBOARD_SHORTCUTS":
        draft.isFetching = false;
        draft.shortcuts = action.shortcuts;
        return draft;

      default:
        return state;
    }
  });
};

const authInitialState: IAuthState = {
  user: null,
  claims: null,
};

const AuthReducer: Reducer<IAuthState> = (state = authInitialState, action: MyActions) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "UPDATE_AUTH_STATE": {
        draft.user = action.user;
        draft.claims = action.claims;
        return draft;
      }

      default:
        return draft;
    }
  });
};

export default combineReducers<IAppState>({
  authData: AuthReducer,
  optionsData: OptionsReducer,
  keyboardShortcutsData: KeyboardShortcutsReducer,
});
