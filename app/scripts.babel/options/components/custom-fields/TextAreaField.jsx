import React, { PropTypes } from 'react';

const TextAreaField = ({ input, label, placeholder, helpText, meta: { touched, error } }) => (
  <div className={`form-group${touched && error ? ' has-error' : ''}`}>
    <label className="control-label col-sm-3">{label}</label>
    <div className="col-sm-9">
      <textarea
        {...input}
        className="form-control"
        placeholder={placeholder}
      />
      { helpText && <div className="help-block">{helpText}</div> }
      {touched && ((error && <span className="help-block">{error}</span>))}
    </div>
  </div>
);

TextAreaField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  helpText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  meta: PropTypes.shape({}),
};

export default TextAreaField;
