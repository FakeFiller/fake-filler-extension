import { Form, Formik, FormikErrors } from 'formik';
import * as React from 'react';

import { GetMessage } from 'src/common/helpers';
import TextField from 'src/options/components/common/TextField';
import DataTypeSelectField from 'src/options/components/custom-fields/DataTypeSelectField';

import AlphanumericOptions from 'src/options/components/custom-fields/data-types/AlphanumericOptions';
import DateOptions from 'src/options/components/custom-fields/data-types/DateOptions';
import NumberOptions from 'src/options/components/custom-fields/data-types/NumberOptions';
import RandomizedListOptions from 'src/options/components/custom-fields/data-types/RandomizedListOptions';
import RegExOptions from 'src/options/components/custom-fields/data-types/RegExOptions';
import TelephoneOptions from 'src/options/components/custom-fields/data-types/TelephoneOptions';
import TextOptions from 'src/options/components/custom-fields/data-types/TextOptions';

const validate = (values: ICustomFieldForm): FormikErrors<ICustomFieldForm> => {
  const errors: FormikErrors<ICustomFieldForm> = {};
  let hasValidType = true;

  if (!values.type) {
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
      const minValue = parseInt(values.numberMin, 10);
      if (isNaN(minValue)) {
        errors.numberMin = GetMessage('customFields_validation_missingMinValue');
      }
      if (!values.numberMax || values.numberMax.length === 0) {
        errors.numberMax = GetMessage('customFields_validation_missingMaxValue');
      }
      if (values.numberMin && values.numberMax && parseInt(values.numberMax, 10) < parseInt(values.numberMin, 10)) {
        errors.numberMax = GetMessage('customFields_validation_invalidMinMaxValue');
      }

      const decimalValue = parseInt(values.numberDecimalPlaces, 10);
      if (isNaN(decimalValue)) {
        errors.numberDecimalPlaces = GetMessage('customFields_validation_missingDecimalPlaces');
      }
    }

    if (values.type === 'text') {
      if (!values.textMin || values.textMin.length === 0) {
        errors.textMin = GetMessage('customFields_validation_missingMinValue');
      }
      if (!values.textMax || values.textMax.length === 0) {
        errors.textMax = GetMessage('customFields_validation_missingMaxValue');
      }
      if (!values.textMaxLength || values.textMaxLength.length === 0) {
        errors.textMaxLength = GetMessage('customFields_validation_missingMaxLength');
      }
      if (values.textMin && parseInt(values.textMin, 10) < 1) {
        errors.textMin = GetMessage('customFields_validation_invalidMaxValue');
      }
      if (values.textMin && values.textMax && parseInt(values.textMax, 10) < parseInt(values.textMin, 10)) {
        errors.textMax = GetMessage('customFields_validation_invalidMinMaxValue');
      }
      if (values.textMaxLength && parseInt(values.textMaxLength, 10) < 1) {
        errors.textMaxLength = GetMessage('customFields_validation_invalidMaxLengthValue');
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

interface IOwnProps {
  customField: ICustomField | null;
  onClose: () => void;
  onSubmit: (formValues: ICustomFieldForm) => void;
}

class CustomFieldForm extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleSubmit(values: ICustomFieldForm): void {
    this.props.onSubmit(values);
  }

  public render(): JSX.Element {
    const initialValues: Partial<ICustomFieldForm> = {};

    if (this.props.customField) {
      initialValues.name = this.props.customField.name;
      initialValues.type = this.props.customField.type;
      initialValues.match = this.props.customField.match.join(', ');

      switch (initialValues.type) {
        case 'alphanumeric':
          initialValues.alphanumericTemplate = this.props.customField.template;
          break;

        case 'date':
          initialValues.dateTemplate = this.props.customField.template;
          break;

        case 'number':
          initialValues.numberMax = String(this.props.customField.max);
          initialValues.numberMin = String(this.props.customField.min);
          initialValues.numberDecimalPlaces = String(this.props.customField.decimalPlaces);
          break;

        case 'randomized-list':
          initialValues.list = this.props.customField.list ? this.props.customField.list.join('\n') : '';
          break;

        case 'regex':
          initialValues.regexTemplate = this.props.customField.template;
          break;

        case 'telephone':
          initialValues.telephoneTemplate = this.props.customField.template;
          break;

        case 'text':
          initialValues.textMax = String(this.props.customField.max);
          initialValues.textMin = String(this.props.customField.min);
          initialValues.textMaxLength = String(this.props.customField.maxLength);
          break;
      }
    }

    return (
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{GetMessage('customFieldDetails_title')} hello</h5>
            <button type="button" className="close" onClick={this.props.onClose}>
              &times;
            </button>
          </div>
          <Formik initialValues={initialValues as ICustomFieldForm} validate={validate} onSubmit={this.handleSubmit}>
            {({ values, isSubmitting, isValid }) => (
              <Form>
                <div className="modal-body">
                  <DataTypeSelectField />
                  <TextField name="name" label={GetMessage('customFields_label_friendlyName')} />
                  <TextField
                    name="match"
                    label={GetMessage('customFields_label_match')}
                    placeholder={GetMessage('customFields_label_match_placeholder')}
                    helpText={GetMessage('customFields_label_match_helpText')}
                  />
                  {values.type === 'telephone' && <TelephoneOptions />}
                  {values.type === 'number' && <NumberOptions />}
                  {values.type === 'date' && <DateOptions />}
                  {values.type === 'alphanumeric' && <AlphanumericOptions />}
                  {values.type === 'text' && <TextOptions />}
                  {values.type === 'regex' && <RegExOptions regexTemplate={values.regexTemplate} />}
                  {values.type === 'randomized-list' && <RandomizedListOptions />}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.props.onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default CustomFieldForm;
