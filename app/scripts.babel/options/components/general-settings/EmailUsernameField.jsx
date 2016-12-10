import React from 'react';
import { Field } from 'redux-form';

import toggleInput from '../shared/ToggleInput';

const EmailUsernameField = (fields) => {
  const usernameField = fields.emailSettings.username;
  const usernameListField = fields.emailSettings.usernameList;

  const fieldHasError = usernameField.meta.invalid || usernameListField.meta.invalid;

  return (
    <div className={`form-group${(fieldHasError) ? ' has-error' : ''}`}>
      <label className="control-label col-sm-3">Username</label>
      <div className="col-sm-9">
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="username"
          label="Use a previously generated username"
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="name"
          label="Use a previously generated first and last name"
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="random"
          label="Use a random name"
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="list"
          label="Select from the list below:"
        />
        <Field
          {...usernameListField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete={false}
          placeholder="Enter comma-separated values."
        />
        <div className="help-block">
          List each name with a comma.
        </div>
        {
          usernameListField.meta.error &&
          <div className="help-block">{usernameListField.meta.error}</div>
        }
      </div>
    </div>
  );
};

export default EmailUsernameField;
