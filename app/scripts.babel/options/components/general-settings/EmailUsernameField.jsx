import React from 'react';
import { Field } from 'redux-form';

import toggleInput from '../shared/ToggleInput';
import { GetMessage } from '../../../form-filler/helpers';

const EmailUsernameField = (fields) => {
  const usernameField = fields.emailSettings.username;
  const usernameListField = fields.emailSettings.usernameList;
  const usernameRegExField = fields.emailSettings.usernameRegEx;

  const fieldHasError = usernameField.meta.invalid
    || usernameListField.meta.invalid
    || usernameRegExField.meta.invalid
    ;

  return (
    <div className={`form-group${(fieldHasError) ? ' has-error' : ''}`}>
      <label className="control-label col-sm-3">{GetMessage('generalSettings_label_username')}</label>
      <div className="col-sm-9">
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="username"
          label={GetMessage('generalSettings_label_username_usernameLabel')}
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="name"
          label={GetMessage('generalSettings_label_username_nameLabel')}
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="random"
          label={GetMessage('generalSettings_label_username_randomLabel')}
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="list"
          label={GetMessage('generalSettings_label_username_listLabel')}
        />
        <Field
          {...usernameListField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete="off"
          placeholder={GetMessage('enterCsv')}
        />
        {
          usernameListField.meta.error &&
          <div className="help-block">{usernameListField.meta.error}</div>
        }
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="regex"
          label={GetMessage('generalSettings_label_username_regExLabel')}
        />
        <Field
          {...usernameRegExField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete="off"
          placeholder={GetMessage('generalSettings_label_username_regExTextPlaceholder')}
        />
        {
          usernameRegExField.meta.error &&
          <div className="help-block">{usernameRegExField.meta.error}</div>
        }
      </div>
    </div>
  );
};

export default EmailUsernameField;
