import React from 'react';
import { Field } from 'redux-form';
import { Link } from 'react-router';

import toggleInput from '../shared/ToggleInput';

const MatchFieldsToggleField = (fields) => {
  const matchLabelField = fields.fieldMatchSettings.matchLabel;
  const matchIdField = fields.fieldMatchSettings.matchId;
  const matchNameField = fields.fieldMatchSettings.matchName;
  const matchClassField = fields.fieldMatchSettings.matchClass;

  const fieldHasError = matchLabelField.meta.invalid
    || matchIdField.meta.invalid
    || matchNameField.meta.invalid
    || matchClassField.meta.invalid
    ;

  return (
    <div className={`form-group${(fieldHasError) ? ' has-error' : ''}`}>
      <label className="control-label col-sm-3">Match Fields Using</label>
      <div className="col-sm-9">
        <Field
          {...matchLabelField.input}
          component={toggleInput}
          type="checkbox"
          label="Label text for the input tag"
        />
        <Field
          {...matchIdField.input}
          component={toggleInput}
          type="checkbox"
          label="ID attribute of the input tag"
        />
        <Field
          {...matchNameField.input}
          component={toggleInput}
          type="checkbox"
          label="Name attribute of the input tag"
        />
        <Field
          {...matchClassField.input}
          component={toggleInput}
          type="checkbox"
          label="Class class attribute of the input tag"
        />
        <br />
        <p>
          Please refer to the <Link to="/custom-fields">custom fields section</Link> to
          learn how input elements are matched.
        </p>
        {
          fieldHasError &&
          <div className="help-block">You must select at least one option.</div>
        }
      </div>
    </div>
  );
};

export default MatchFieldsToggleField;
