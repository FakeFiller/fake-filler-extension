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

export function deleteCustomField(options, index) {
  return (dispatch) => {
    const newOptions = Object.assign({}, options);
    newOptions.fields.splice(index, 1);
    SaveFormFillerOptions(newOptions);
    dispatch({ type: AppConstants.RECEIVED_OPTIONS, options: newOptions });
  };
}

export function saveSortedCustomFields(options, customFields) {
  return (dispatch) => {
    const newOptions = Object.assign({}, options);
    newOptions.fields = customFields;
    SaveFormFillerOptions(newOptions);
    dispatch({ type: AppConstants.RECEIVED_OPTIONS, options: newOptions });
  };
}

export function saveCustomField(options, customField, customFieldIndex) {
  return (dispatch) => {
    const newOptions = Object.assign({}, options);

    if (customFieldIndex < 0) {
      newOptions.fields.push(customField);
    } else {
      newOptions.fields[customFieldIndex] = customField;
    }

    SaveFormFillerOptions(newOptions);
    dispatch({ type: AppConstants.RECEIVED_OPTIONS, options: newOptions });
  };
}
