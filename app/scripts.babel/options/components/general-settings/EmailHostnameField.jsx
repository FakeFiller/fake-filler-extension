import React from 'react';
import { Field } from 'redux-form';

import toggleInput from '../shared/ToggleInput';
import { GetMessage } from '../../../form-filler/helpers';

const EmailHostnameField = (fields) => {
  const hostnameField = fields.emailSettings.hostname;
  const hostnameListField = fields.emailSettings.hostnameList;

  const fieldHasError = hostnameField.meta.invalid || hostnameListField.meta.invalid;

  return (
    <div className={`form-group${(fieldHasError) ? ' has-error' : ''}`}>
      <label className="control-label col-sm-3">{GetMessage('generalSettings_label_hostName')}</label>
      <div className="col-sm-9">
        <Field
          {...hostnameField.input}
          component={toggleInput}
          type="radio"
          value="random"
          label={GetMessage('generalSettings_label_hostName_randomLabel')}
        />
        <Field
          {...hostnameField.input}
          component={toggleInput}
          type="radio"
          value="list"
          label={GetMessage('generalSettings_label_hostName_listLabel')}
        />
        <Field
          {...hostnameListField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete="off"
          placeholder={GetMessage('enterCsv')}
        />
        <div className="help-block">{GetMessage('generalSettings_label_hostName_listTextHelp')}</div>
        {
          hostnameListField.meta.error &&
          <div className="help-block">{hostnameListField.meta.error}</div>
        }
      </div>
    </div>
  );
};

export default EmailHostnameField;
