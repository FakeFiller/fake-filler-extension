/* eslint-disable react/no-danger */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import RandExp from 'randexp';

import DataTypeField from './DataTypeField';
import TextField from './TextField';
import TextAreaField from './TextAreaField';
import { GetMessage } from '../../../form-filler/helpers';

// eslint-disable-next-line max-len
const customFieldMatchRegEx = /^(first-name|last-name|full-name|username|email|organization|telephone|number|date|url|text|alphanumeric|regex|randomized-list)$/;

const validate = (values) => {
  const errors = {};
  let hasValidType = true;

  if (!values.type || !values.type.match(customFieldMatchRegEx)) {
    errors.type = GetMessage('customFields_validation_missingType');
    hasValidType = false;
  }

  if (!values.name || values.name.length === 0) {
    errors.name = GetMessage('customFields_validation_missingName');
  }

  if (!values.match || values.match.length === 0) {
    errors.match = GetMessage('customFields_validation_missingMatch');
  }

  if (hasValidType) {
    if (values.type === 'telephone' && (!values.telephoneTemplate || values.telephoneTemplate.length === 0)) {
      errors.telephoneTemplate = GetMessage('customFields_validation_missingTelephoneTemplate');
    }

    if (values.type === 'number') {
      if (!values.numberMin || values.numberMin.length === 0) {
        errors.numberMin = GetMessage('customFields_validation_missingMinValue');
      }
      if (!values.numberMax || values.numberMax.length === 0) {
        errors.numberMax = GetMessage('customFields_validation_missingMaxValue');
      }
      if (values.numberMin && values.numberMax && parseInt(values.numberMax, 10) < parseInt(values.numberMin, 10)) {
        errors.numberMax = GetMessage('customFields_validation_invalidMinMaxValue');
      }
    }

    if (values.type === 'text') {
      if (!values.textMin || values.textMin.length === 0) {
        errors.textMin = GetMessage('customFields_validation_missingMinValue');
      }
      if (!values.textMax || values.textMax.length === 0) {
        errors.textMax = GetMessage('customFields_validation_missingMaxValue');
      }
      if (values.textMin && parseInt(values.textMin, 10) < 1) {
        errors.textMin = GetMessage('customFields_validation_invalidMaxValue');
      }
      if (values.textMin && values.textMax && parseInt(values.textMax, 10) < parseInt(values.textMin, 10)) {
        errors.textMax = GetMessage('customFields_validation_invalidMinMaxValue');
      }
    }

    if (values.type === 'date' && (!values.dateTemplate || values.dateTemplate.length === 0)) {
      errors.dateTemplate = GetMessage('customFields_validation_missingDateTemplate');
    }

    if (values.type === 'alphanumeric' && (!values.alphanumericTemplate || values.alphanumericTemplate.length === 0)) {
      errors.alphanumericTemplate = GetMessage('customFields_validation_missingAlNumTemplate');
    }

    if (values.type === 'regex' && (!values.regexTemplate || values.regexTemplate.length === 0)) {
      errors.regexTemplate = GetMessage('customFields_validation_missingRegEx');
    }

    if (values.type === 'randomized-list' && (!values.list || values.list.length === 0)) {
      errors.list = GetMessage('customFields_validation_missingRandomItems');
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

  // eslint-disable-next-line class-methods-use-this
  getHtmlMarkup(text) {
    return { __html: text };
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
      <span dangerouslySetInnerHTML={this.getHtmlMarkup(GetMessage('customFields_dateTypeHelp'))} />
    );

    const alphanumericTypeHelpText = (
      <div>
        <div className="row">
          <div className="col-sm-6">
            <code>L</code> {GetMessage('customFields_alNumHelp_uppercaseLetter')}<br />
            <code>l</code> {GetMessage('customFields_alNumHelp_lowercaseLetter')}<br />
            <code>D</code> {GetMessage('customFields_alNumHelp_upperAndLowercaseLetter')}<br />
            <code>C</code> {GetMessage('customFields_alNumHelp_uppercaseConsonant')}<br />
            <code>c</code> {GetMessage('customFields_alNumHelp_lowercaseConsonant')}<br />
            <code>E</code> {GetMessage('customFields_alNumHelp_upperAndLowercaseConsonant')}
          </div>
          <div className="col-sm-6">
            <code>V</code> {GetMessage('customFields_alNumHelp_uppercaseVowel')}<br />
            <code>v</code> {GetMessage('customFields_alNumHelp_lowercaseVowel')}<br />
            <code>F</code> {GetMessage('customFields_alNumHelp_upperAndLowercaseVowel')}<br />
            <code>x</code> {GetMessage('customFields_alNumHelp_number09')}<br />
            <code>X</code> {GetMessage('customFields_alNumHelp_number19')}
          </div>
        </div>
        <br />
        <p>{GetMessage('customFields_alNumHelp_otherCharactersAsIs')}</p>
      </div>
    );

    const regexTypeHelpText = (
      <div>
        <p dangerouslySetInnerHTML={this.getHtmlMarkup(GetMessage('customFields_regExHelp'))} />
        <button
          type="button"
          className="btn btn-xs btn-default"
          onClick={this.generateRadomRegExString}
        >
          {GetMessage('testMe')}
        </button>
      </div>
    );

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">{GetMessage('close')}</span>
            </button>
            <h4 className="modal-title">{GetMessage('customFields_customFieldDetails')}</h4>
          </div>
          <div className="modal-body">
            <Field
              name="type"
              component={DataTypeField}
              label={GetMessage('customFields_label_dataType')}
            />
            <Field
              name="name"
              type="text"
              component={TextField}
              label={GetMessage('customFields_label_friendlyName')}
            />
            <Field
              name="match"
              type="text"
              component={TextField}
              label={GetMessage('customFields_label_match')}
              placeholder={GetMessage('customFields_label_match_placeholder')}
              helpText={GetMessage('customFields_label_match_helpText')}
            />
            {
              typeValue === 'telephone' &&
              <Field
                name="telephoneTemplate"
                type="text"
                component={TextField}
                label={GetMessage('customFields_label_template')}
                helpText={GetMessage('customFields_label_telephoneTemplate_helpText')}
              />
            }
            {
              typeValue === 'number' &&
              <Field
                name="numberMin"
                type="number"
                component={TextField}
                label={GetMessage('customFields_label_minValue')}
              />
            }
            {
              typeValue === 'number' &&
              <Field
                name="numberMax"
                type="number"
                component={TextField}
                label={GetMessage('customFields_label_maxValue')}
              />
            }
            {
              typeValue === 'date' &&
              <Field
                name="dateTemplate"
                type="text"
                component={TextField}
                label={GetMessage('customFields_label_template')}
                helpText={dateTypeHelpText}
              />
            }
            {
              typeValue === 'text' &&
              <Field
                name="textMin"
                type="number"
                component={TextField}
                label={GetMessage('customFields_label_minWords')}
              />
            }
            {
              typeValue === 'text' &&
              <Field
                name="textMax"
                type="number"
                component={TextField}
                label={GetMessage('customFields_label_maxWords')}
              />
            }
            {
              typeValue === 'alphanumeric' &&
              <Field
                name="alphanumericTemplate"
                type="text"
                component={TextField}
                label={GetMessage('customFields_label_format')}
                helpText={alphanumericTypeHelpText}
              />
            }
            {
              typeValue === 'regex' &&
              <Field
                name="regexTemplate"
                type="text"
                component={TextField}
                label={GetMessage('customFields_label_pattern')}
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
                label={GetMessage('customFields_label_listItems')}
                placeholder={GetMessage('customFields_label_listItems_placeholder')}
              />
            }
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={onClose}>{GetMessage('cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={!valid}>{GetMessage('save')}</button>
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
