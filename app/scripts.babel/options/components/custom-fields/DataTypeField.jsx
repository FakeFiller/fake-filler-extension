import React, { PropTypes } from 'react';

import { GetMessage } from '../../../form-filler/helpers';

const DataTypeField = ({ input, label, helpText, meta: { dirty, touched, error } }) => (
  <div className={`form-group${touched && dirty && error ? ' has-error' : ''}`}>
    <label className="control-label col-sm-3">{label}</label>
    <div className="col-sm-9">
      <select {...input} className="form-control">
        <option value="">{GetMessage('customFields_dataType_select')}</option>
        <optgroup label={GetMessage('customFields_dataType_humanDataLabel')}>
          <option value="first-name">{GetMessage('customFields_dataType_firstName')}</option>
          <option value="last-name">{GetMessage('customFields_dataType_lastName')}</option>
          <option value="full-name">{GetMessage('customFields_dataType_fullName')}</option>
          <option value="username">{GetMessage('customFields_dataType_username')}</option>
          <option value="email">{GetMessage('customFields_dataType_emailAddress')}</option>
          <option value="organization">{GetMessage('customFields_dataType_companyName')}</option>
          <option value="telephone">{GetMessage('customFields_dataType_telephone')}</option>
          <option value="number">{GetMessage('customFields_dataType_number')}</option>
          <option value="date">{GetMessage('customFields_dataType_date')}</option>
          <option value="url">{GetMessage('customFields_dataType_url')}</option>
        </optgroup>
        <optgroup label={GetMessage('customFields_dataType_otherLabel')}>
          <option value="text">{GetMessage('customFields_dataType_text')}</option>
          <option value="alphanumeric">{GetMessage('customFields_dataType_alphaNumeric')}</option>
          <option value="regex">{GetMessage('customFields_dataType_regEx')}</option>
          <option value="randomized-list">{GetMessage('customFields_dataType_randomizedList')}</option>
        </optgroup>
      </select>
      { helpText && <div className="help-block">{helpText}</div> }
      { touched && dirty && ((error && <span className="help-block">{error}</span>)) }
    </div>
  </div>
);

DataTypeField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  helpText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  meta: PropTypes.shape({}).isRequired,
};

DataTypeField.defaultProps = {
  helpText: '',
};

export default DataTypeField;
