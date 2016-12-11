import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import RandExp from 'randexp';

import DataTypeField from './DataTypeField';
import TextField from './TextField';
import TextAreaField from './TextAreaField';

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
    if (values.type === 'telephone' && (!values.template || values.template.length === 0)) {
      errors.template = 'Please enter a template for the telephone number.';
    }

    if (values.type === 'number' || values.type === 'text') {
      if (!values.min || values.min.length === 0) {
        errors.min = 'Please enter a minimum value.';
      }
      if (!values.max || values.max.length === 0) {
        errors.max = 'Please enter a maximum value.';
      }
      if (values.min && values.max && values.max < values.min) {
        errors.max = 'The maximum value cannot be less than the minimum values.';
      }
    }

    if (values.type === 'date' && (!values.template || values.template.length === 0)) {
      errors.template = 'Please enter a template for the date.';
    }

    if (values.type === 'alphanumeric' && (!values.template || values.template.length === 0)) {
      errors.template = 'Please specify a format template for this field.';
    }

    if (values.type === 'regex' && (!values.template || values.template.length === 0)) {
      errors.template = 'Please enter a regular expression.';
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
    if (this.props.regexPatternValue) {
      let randomValue;

      try {
        randomValue = new RandExp(this.props.regexPatternValue).gen();
      } catch (e) {
        randomValue = e.toString();
      }

      this.setState({
        regexSample: randomValue,
      });
    }
  }

  render() {
    const { typeValue, onClose, handleSubmit, pristine, valid } = this.props;

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
              helpText="Enter comma separated values (in lowercase) to match, or a regular expression. Make sure your regular expression does not have a comma."
            />
            {
              typeValue === 'telephone' &&
              <Field
                name="template"
                type="text"
                component={TextField}
                label="Template"
                helpText="Use X for a number between 1-9 and x for 0-9."
              />
            }
            {
              typeValue === 'number' &&
              <Field
                name="min"
                type="number"
                component={TextField}
                label="Minimum Value"
              />
            }
            {
              typeValue === 'number' &&
              <Field
                name="max"
                type="number"
                component={TextField}
                label="Maximum Value"
              />
            }
            {
              typeValue === 'date' &&
              <Field
                name="template"
                type="text"
                component={TextField}
                label="Template"
                helpText={dateTypeHelpText}
              />
            }
            {
              typeValue === 'text' &&
              <Field
                name="min"
                type="number"
                component={TextField}
                label="Minimum Words"
              />
            }
            {
              typeValue === 'text' &&
              <Field
                name="max"
                type="number"
                component={TextField}
                label="Maximum Words"
              />
            }
            {
              typeValue === 'alphanumeric' &&
              <Field
                name="template"
                type="text"
                component={TextField}
                label="Format"
                helpText={alphanumericTypeHelpText}
              />
            }
            {
              typeValue === 'regex' &&
              <Field
                name="template"
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
            <button type="submit" className="btn btn-primary" disabled={pristine || !valid}>
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
  pristine: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  typeValue: PropTypes.string,
  regexPatternValue: PropTypes.string,
};

const FormComponent = reduxForm({
  form: 'customFieldForm',
  validate,
  enableReinitialize: true,
})(CustomFieldForm);

const selector = formValueSelector('customFieldForm');

function mapStateToProps(state, ownProps) {
  const typeValue = selector(state, 'type');
  const regexPatternValue = selector(state, 'template');

  const initialValues = Object.assign({}, ownProps.customField, {
    match: ownProps.customField.match ? ownProps.customField.match.join(', ') : '',
    list: ownProps.customField.list ? ownProps.customField.list.join('\n') : '',
  });

  // if (typeValue === 'telephone' && !ownProps.customField.template) {
  //   initialValues.template = '+XXX-Xx-Xxxxxxx';
  // }

  // if (typeValue === 'date' && !ownProps.customField.template) {
  //   initialValues.template = 'DD-MMM-YYYY';
  // }

  return {
    typeValue,
    regexPatternValue,
    initialValues,
  };
}

const ConnectedFormComponent = connect(mapStateToProps)(FormComponent);

export default ConnectedFormComponent;
