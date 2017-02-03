import React, { PropTypes } from 'react';

const TextField = ({
  input,
  label,
  type,
  placeholder,
  helpText,
  meta: {
    dirty,
    touched,
    error,
  },
}) => (
  <div className={`form-group${touched && dirty && error ? ' has-error' : ''}`}>
    <label className="control-label col-sm-3">{label}</label>
    <div className={type === 'number' ? 'col-sm-4' : 'col-sm-9'}>
      <input
        {...input}
        type={type}
        className="form-control"
        placeholder={placeholder}
        autoComplete="off"
      />
      { helpText && <div className="help-block">{helpText}</div> }
      { touched && dirty && ((error && <span className="help-block">{error}</span>)) }
    </div>
  </div>
);

TextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  helpText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  meta: PropTypes.shape({}).isRequired,
};

TextField.defaultProps = {
  placeholder: '',
  helpText: '',
};

export default TextField;
