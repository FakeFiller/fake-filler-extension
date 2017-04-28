import React from 'react';
import { Field } from 'redux-form';
import { Link } from 'react-router';

import toggleInput from '../shared/ToggleInput';
import language from '../../../form-filler/language'

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
      <label className="control-label col-sm-3">{language("matchFieldUse")}</label>
      <div className="col-sm-9">
        <Field
          {...matchLabelField.input}
          component={toggleInput}
          type="checkbox"
          label={language("labelForInput")}
        />
        <Field
          {...matchIdField.input}
          component={toggleInput}
          type="checkbox"
          label={language("IDForInput")}
        />
        <Field
          {...matchNameField.input}
          component={toggleInput}
          type="checkbox"
          label={language("nameForInput")}
        />
        <Field
          {...matchClassField.input}
          component={toggleInput}
          type="checkbox"
          label={language("classForInput")}
        />
        <br />
        <p>
            {language("pleaseRefer")} <Link to="/custom-fields">{language("customSection")}</Link>
            {language("learnHowInputMatch")}
        </p>
        {
          fieldHasError &&
          <div className="help-block">{language("atLeastOne")}</div>
        }
      </div>
    </div>
  );
};

export default MatchFieldsToggleField;
