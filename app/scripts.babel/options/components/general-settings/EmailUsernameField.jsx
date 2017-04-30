import React from 'react';
import { Field } from 'redux-form';

import toggleInput from '../shared/ToggleInput';
import language from '../../../form-filler/language';

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
      <label className="control-label col-sm-3">{language("username")}</label>
      <div className="col-sm-9">
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="username"
          label={language("lastUsername")}
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="name"
          label={language("lastName")}
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="random"
          label={language("randomName")}
        />
        <Field
          {...usernameField.input}
          component={toggleInput}
          type="radio"
          value="list"
          label={language("listName")}
        />
        <Field
          {...usernameListField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete="off"
          placeholder="Enter comma-separated values."
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
          label={language("regexUsername")}
        />
        <Field
          {...usernameRegExField.input}
          type="text"
          component="input"
          className="form-control"
          autoComplete="off"
          placeholder={language("placeholderRegex")}
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
