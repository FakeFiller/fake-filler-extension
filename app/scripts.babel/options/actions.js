import AppConstants from './constants';

import {
  FormFillerDefaultOptions,
  GetFormFillerOptions,
  SaveFormFillerOptions,
} from '../form-filler/helpers';

export function getOptions() {
  return (dispatch) => {
    dispatch({ type: AppConstants.FETCHING_OPTIONS });

    GetFormFillerOptions().then((options) => {
      dispatch({ type: AppConstants.RECEIVED_OPTIONS, options });
    });
  };
}

export function resetOptions() {
  return (dispatch) => {
    const options = FormFillerDefaultOptions();
    SaveFormFillerOptions(options);
    dispatch({ type: AppConstants.RECEIVED_OPTIONS, options });
  };
}

export function saveOptions(options) {
  return (dispatch) => {
    SaveFormFillerOptions(options);
    dispatch({ type: AppConstants.RECEIVED_OPTIONS, options });
  };
}
