import React from 'react';
import { Field } from 'redux-form';
import toggleInput from '../shared/ToggleInput';
import language from '../../../form-filler/language';

const EmailHostnameField = (fields) => {
  const hostnameField = fields.emailSettings.hostname;
  const hostnameListField = fields.emailSettings.hostnameList;
  const fieldHasError = hostnameField.meta.invalid || hostnameListField.meta.invalid;

  return (
    <div className={`form-group${(fieldHasError) ? ' has-error' : ''}`}>
      <label className="control-label col-sm-3">{language("hostName")}</label>
      <div className="col-sm-9">
        <Field
          {...hostnameField.input}
          component={toggleInput}
          type="radio"
          value="random"
          label={language("randomHost")}
        />
        <Field
          {...hostnameField.input}
          component={toggleInput}
          type="radio"
          value="list"
          label={language("listName")}
        />
        <Field
          {...hostnameListField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete="off"
          placeholder="Enter comma-separated values."
        />
        <div className="help-block">
            {language("listName")} You may include the @ sign as well.
        </div>
        {
          hostnameListField.meta.error &&
          <div className="help-block">{hostnameListField.meta.error}</div>
        }
      </div>
    </div>
  );
};

export default EmailHostnameField;
