import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import RandExp from 'randexp';

import DataTypeField from './DataTypeField';
import TextField from './TextField';
import TextAreaField from './TextAreaField';

// eslint-disable-next-line max-len
const customFieldMatchRegEx = /^(first-name|last-name|full-name|username|email|organization|telephone|number|date|url|text|alphanumeric|regex|randomized-list)$/;

const validate = (values) => {
  const errors = {};
  let hasValidType = true;

  if (!values.type || !values.type.match(customFieldMatchRegEx)) {
    errors.type = 'Please select a type.';
    hasValidType = false;
  }

  if (!values.name || values.name.length === 0) {
    errors.name = 'Please enter a name for this custom field.';
  }

  if (!values.match || values.match.length === 0) {
    errors.match = 'Please enter comma-separated values or a regular expression.';
  }

  if (hasValidType) {
    if (values.type === 'telephone' && (!values.telephoneTemplate || values.telephoneTemplate.length === 0)) {
      errors.telephoneTemplate = 'Please enter a template for the telephone number.';
    }

    if (values.type === 'number') {
      if (!values.numberMin || values.numberMin.length === 0) {
        errors.numberMin = 'Please enter a minimum value.';
      }
      if (!values.numberMax || values.numberMax.length === 0) {
        errors.numberMax = 'Please enter a maximum value.';
      }
      if (values.numberMin && values.numberMax && parseInt(values.numberMax, 10) < parseInt(values.numberMin, 10)) {
        errors.numberMax = 'The maximum value cannot be less than the minimum values.';
      }
    }

    if (values.type === 'text') {
      if (!values.textMin || values.textMin.length === 0) {
        errors.textMin = 'Please enter a minimum value.';
      }
      if (!values.textMax || values.textMax.length === 0) {
        errors.textMax = 'Please enter a maximum value.';
      }
      if (values.textMin && parseInt(values.textMin, 10) < 1) {
        errors.textMin = 'The minimum value must be greater than one.';
      }
      if (values.textMin && values.textMax && parseInt(values.textMax, 10) < parseInt(values.textMin, 10)) {
        errors.textMax = 'The maximum value cannot be less than the minimum values.';
      }
    }

    if (values.type === 'date' && (!values.dateTemplate || values.dateTemplate.length === 0)) {
      errors.dateTemplate = 'Please enter a template for the date.';
    }

    if (values.type === 'alphanumeric' && (!values.alphanumericTemplate || values.alphanumericTemplate.length === 0)) {
      errors.alphanumericTemplate = 'Please specify a format template for this field.';
    }

    if (values.type === 'regex' && (!values.regexTemplate || values.regexTemplate.length === 0)) {
      errors.regexTemplate = 'Please enter a regular expression.';
    }

    if (values.type === 'randomized-list' && (!values.list || values.list.length === 0)) {
      errors.list = 'Please enter some items.';
    }
  }

  return errors;
};

class CustomFieldForm extends Component {
  constructor(props) {
    super(props);

    this.generateRadomRegExString = this.generateRadomRegExString.bind(this);

    this.state = {
      regexSample: '',
    };
  }

  generateRadomRegExString() {
    if (this.props.regexTemplateValue) {
      let randomValue;

      try {
        randomValue = new RandExp(this.props.regexTemplateValue).gen();
      } catch (e) {
        randomValue = e.toString();
      }

      this.setState({
        regexSample: randomValue,
      });
    }
  }

  render() {
    const { typeValue, onClose, handleSubmit, valid } = this.props;

    const dateTypeHelpText = (
      <span>
        Uses moment.js to format date/time values. Please refer to the
        moment.js <a
          href="http://momentjs.com/docs/#/displaying/format/"
          target="_blank"
          rel="noopener noreferrer"
        >documentation</a>.
      </span>
    );

    const alphanumericTypeHelpText = (
      <div>
        <div className="row">
          <div className="col-sm-6">
            <code>L</code> An uppercase Letter.<br />
            <code>l</code> lowercase letter.<br />
            <code>D</code> A letter (upper or lower).<br />
            <code>C</code> An uppercase Consonant.<br />
            <code>c</code> A lowercase consonant.<br />
            <code>E</code> A consonant (upper or lower).
          </div>
          <div className="col-sm-6">
            <code>V</code> An uppercase Vowel.<br />
            <code>v</code> A lowercase vowel.<br />
            <code>F</code> A vowel (upper or lower).<br />
            <code>x</code> Any number, 0-9.<br />
            <code>X</code> Any number, 1-9.
          </div>
        </div>
        <br />
        <p>
          Any other character will be output as-is. The above characters can be escaped by wrapping
          them in [square brackets].
        </p>
      </div>
    );

    const regexTypeHelpText = (
      <div>
        <p>
          Uses <a href="http://fent.github.io/randexp.js/" target="_blank" rel="noreferrer noopener">
          randexp.js</a> to generate random data based on a regular expression pattern.
        </p>
        <button
          type="button"
          className="btn btn-xs btn-default"
          onClick={this.generateRadomRegExString}
        >
          Test Me
        </button>
      </div>
    );

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Custom Field Details</h4>
          </div>
          <div className="modal-body">
            <Field
              name="type"
              component={DataTypeField}
              label="Data Type"
            />
            <Field
              name="name"
              type="text"
              component={TextField}
              label="Friendly Name"
            />
            <Field
              name="match"
              type="text"
              component={TextField}
              label="Match"
              placeholder="Comma-separated values or a regular expression."
              helpText="Enter comma separated values (in lowercase) to match, or a regular expression. Make sure your regular expression does not have a comma." // eslint-disable-line max-len
            />
            {
              typeValue === 'telephone' &&
              <Field
                name="telephoneTemplate"
                type="text"
                component={TextField}
                label="Template"
                helpText="Use X for a number between 1-9 and x for 0-9."
              />
            }
            {
              typeValue === 'number' &&
              <Field
                name="numberMin"
                type="number"
                component={TextField}
                label="Minimum Value"
              />
            }
            {
              typeValue === 'number' &&
              <Field
                name="numberMax"
                type="number"
                component={TextField}
                label="Maximum Value"
              />
            }
            {
              typeValue === 'date' &&
              <Field
                name="dateTemplate"
                type="text"
                component={TextField}
                label="Template"
                helpText={dateTypeHelpText}
              />
            }
            {
              typeValue === 'text' &&
              <Field
                name="textMin"
                type="number"
                component={TextField}
                label="Minimum Words"
              />
            }
            {
              typeValue === 'text' &&
              <Field
                name="textMax"
                type="number"
                component={TextField}
                label="Maximum Words"
              />
            }
            {
              typeValue === 'alphanumeric' &&
              <Field
                name="alphanumericTemplate"
                type="text"
                component={TextField}
                label="Format"
                helpText={alphanumericTypeHelpText}
              />
            }
            {
              typeValue === 'regex' &&
              <Field
                name="regexTemplate"
                type="text"
                component={TextField}
                label="Pattern"
                helpText={regexTypeHelpText}
              />
            }
            {
              typeValue === 'regex' && this.state.regexSample &&
              <div className="form-group">
                <div className="col-sm-9 col-sm-offset-3">{this.state.regexSample}</div>
              </div>
            }
            {
              typeValue === 'randomized-list' &&
              <Field
                name="list"
                component={TextAreaField}
                label="List Items"
                placeholder="Enter each item on a new line."
              />
            }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!valid}>
              Save
            </button>
          </div>
        </div>
      </form>
    );
  }
}

CustomFieldForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  typeValue: PropTypes.string,
  regexTemplateValue: PropTypes.string,
};

CustomFieldForm.defaultProps = {
  typeValue: '',
  regexTemplateValue: '',
};

const FormComponent = reduxForm({
  form: 'customFieldForm',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(CustomFieldForm);

const selector = formValueSelector('customFieldForm');

function mapStateToProps(state, ownProps) {
  const customField = ownProps.customField;
  const typeValue = selector(state, 'type');
  const regexTemplateValue = selector(state, 'regexTemplate');

  const initialValues = Object.assign({}, customField, {
    match: customField.match ? customField.match.join(', ') : '',
    list: customField.list ? customField.list.join('\n') : '',
    telephoneTemplate: '+XXX-Xx-Xxxxxxx',
    dateTemplate: 'DD-MMM-YYYY',
    numberMin: 0,
    numberMax: 99999,
    textMin: 1,
    textMax: 20,
  });

  if (typeValue === 'telephone') {
    initialValues.telephoneTemplate = customField.template || '+XXX-Xx-Xxxxxxx';
  }

  if (typeValue === 'date') {
    initialValues.dateTemplate = customField.template || 'DD-MMM-YYYY';
  }

  if (typeValue === 'alphanumeric') {
    initialValues.alphanumericTemplate = customField.template;
  }

  if (typeValue === 'regex') {
    initialValues.regexTemplate = customField.template;
  }

  if (typeValue === 'number') {
    initialValues.numberMin = customField.min || 0;
    initialValues.numberMax = customField.max || 99999;
  }

  if (typeValue === 'text') {
    initialValues.textMin = customField.min || 1;
    initialValues.textMax = customField.max || 20;
  }

  delete initialValues.template;
  delete initialValues.min;
  delete initialValues.max;

  return {
    typeValue,
    regexTemplateValue,
    initialValues,
  };
}

const ConnectedFormComponent = connect(mapStateToProps)(FormComponent);

export default ConnectedFormComponent;
