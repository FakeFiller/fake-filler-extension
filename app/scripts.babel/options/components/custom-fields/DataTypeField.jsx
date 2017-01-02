import React, { PropTypes } from 'react';

const DataTypeField = ({ input, label, helpText, meta: { dirty, touched, error } }) => (
  <div className={`form-group${touched && dirty && error ? ' has-error' : ''}`}>
    <label className="control-label col-sm-3">{label}</label>
    <div className="col-sm-9">
      <select {...input} className="form-control">
        <option value="">-- select --</option>
        <optgroup label="Human Data">
          <option value="first-name">First Name</option>
          <option value="last-name">Last Name</option>
          <option value="full-name">Full Name</option>
          <option value="username">Username</option>
          <option value="email">Email Address</option>
          <option value="organization">Organization/Company Name</option>
          <option value="telephone">Telephone Number</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="url">URL/Website Address</option>
        </optgroup>
        <optgroup label="Other">
          <option value="text">Text</option>
          <option value="alphanumeric">Alphanumeric</option>
          <option value="regex">Regular Expression</option>
          <option value="randomized-list">Randomized List</option>
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
  meta: PropTypes.shape({}),
};

export default DataTypeField;
