import { UnknownAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { MyActions } from "src/options/actions";
import { IOptionsState, IKeyboardShortcutsState } from "src/types";

const optionsInitialState: IOptionsState = {
  isFetching: false,
  options: null,
};

// Redux hands every action to every reducer; only this app's own actions change the state.
const OptionsReducer = (state: IOptionsState = optionsInitialState, unknownAction: UnknownAction): IOptionsState => {
  const action = unknownAction as MyActions;
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

const KeyboardShortcutsReducer = (
  state: IKeyboardShortcutsState = shortcutsInitialState,
  unknownAction: UnknownAction
): IKeyboardShortcutsState => {
  const action = unknownAction as MyActions;
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

const reducers = {
  optionsData: OptionsReducer,
  keyboardShortcutsData: KeyboardShortcutsReducer,
};

export default reducers;
