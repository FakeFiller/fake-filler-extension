import AppConstants from './constants';

import {
  FormFillerDefaultOptions,
  GetFormFillerOptions,
  SaveFormFillerOptions,
  GetKeyboardShortcuts,
  CsvToArray,
  MultipleLinesToArray,
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

    const newCustomField = Object.assign({}, customField, {
      match: CsvToArray(customField.match),
    });

    if (newCustomField.type === 'number') {
      newCustomField.min = parseInt(newCustomField.numberMin, 10);
      newCustomField.max = parseInt(newCustomField.numberMax, 10);
    }

    if (newCustomField.type === 'text') {
      newCustomField.min = parseInt(newCustomField.textMin, 10);
      newCustomField.max = parseInt(newCustomField.textMax, 10);
    }

    if (newCustomField.type === 'telephone') {
      newCustomField.template = newCustomField.telephoneTemplate;
    }

    if (newCustomField.type === 'date') {
      newCustomField.template = newCustomField.dateTemplate;
    }

    if (newCustomField.type === 'alphanumeric') {
      newCustomField.template = newCustomField.alphanumericTemplate;
    }

    if (newCustomField.type === 'regex') {
      newCustomField.template = newCustomField.regexTemplate;
    }

    if (newCustomField.type === 'randomized-list') {
      newCustomField.list = customField.list ? MultipleLinesToArray(customField.list) : null;
    }

    if (!newCustomField.type.match(/^(number|text)$/)) {
      delete newCustomField.min;
      delete newCustomField.max;
    }

    if (!newCustomField.type.match(/^(telephone|date|alphanumeric|regex)$/)) {
      delete newCustomField.template;
    }

    if (newCustomField.type !== 'randomized-list') {
      delete newCustomField.list;
    }

    delete newCustomField.numberMin;
    delete newCustomField.numberMax;
    delete newCustomField.textMin;
    delete newCustomField.textMax;
    delete newCustomField.telephoneTemplate;
    delete newCustomField.dateTemplate;
    delete newCustomField.alphanumericTemplate;
    delete newCustomField.regexTemplate;

    if (customFieldIndex < 0) {
      newOptions.fields.push(newCustomField);
    } else {
      newOptions.fields[customFieldIndex] = newCustomField;
    }

    SaveFormFillerOptions(newOptions);
    dispatch({ type: AppConstants.RECEIVED_OPTIONS, options: newOptions });
  };
}

export function getKeyboardShortcuts() {
  return (dispatch) => {
    dispatch({ type: AppConstants.FETCHING_KEYBOARD_SHORTCUTS });

    GetKeyboardShortcuts().then((shortcuts) => {
      dispatch({ type: AppConstants.RECEIVED_KEYBOARD_SHORTCUTS, shortcuts });
    });
  };
}
