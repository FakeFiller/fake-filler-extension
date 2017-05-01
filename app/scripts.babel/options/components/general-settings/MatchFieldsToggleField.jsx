import React from 'react';
import { Field } from 'redux-form';

import toggleInput from '../shared/ToggleInput';
import { GetMessage } from '../../../form-filler/helpers';

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
      <label className="control-label col-sm-3">{GetMessage('generalSettings_matchFieldsUsing')}</label>
      <div className="col-sm-9">
        <Field
          {...matchLabelField.input}
          component={toggleInput}
          type="checkbox"
          label={GetMessage('generalSettings_matchFields_useLabel')}
        />
        <Field
          {...matchIdField.input}
          component={toggleInput}
          type="checkbox"
          label={GetMessage('generalSettings_matchFields_useId')}
        />
        <Field
          {...matchNameField.input}
          component={toggleInput}
          type="checkbox"
          label={GetMessage('generalSettings_matchFields_useName')}
        />
        <Field
          {...matchClassField.input}
          component={toggleInput}
          type="checkbox"
          label={GetMessage('generalSettings_matchFields_useClass')}
        />
        <br />
        <p>{GetMessage('generalSettings_matchFields_help')}</p>
        {
          fieldHasError &&
          <div className="help-block">{GetMessage('generalSettings_matchFields_mustSelectOneOption')}</div>
        }
      </div>
    </div>
  );
};

export default MatchFieldsToggleField;
