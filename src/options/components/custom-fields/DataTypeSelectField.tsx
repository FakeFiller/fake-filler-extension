import { ErrorMessage, Field, FieldProps, FormikProps } from 'formik';
import * as React from 'react';

import { GetMessage } from 'src/common/helpers';

interface OwnProps {}

class DataTypeSelectField extends React.PureComponent<OwnProps> {
  private form: FormikProps<ICustomFieldForm> | undefined;

  constructor(props: OwnProps) {
    super(props);

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    if (!this.form) {
      return;
    }

    this.form.handleChange(event);

    const value = event.target.value as CustomFieldTypes;

    if (value === 'telephone' && !this.form.values.telephoneTemplate) {
      this.form.setFieldValue('telephoneTemplate', 'hi');
    } else if (value === 'number' && !this.form.values.numberMin && !this.form.values.numberMax) {
      this.form.setFieldValue('numberMin', 0);
      this.form.setFieldValue('numberMax', 99999);
      this.form.setFieldValue('numberPlaces', 0);
    }

    switch (value) {
      case 'telephone':
        if (!this.form.values.telephoneTemplate) {
          this.form.setFieldValue('telephoneTemplate', '+1 (XxX) XxX-XxxX');
        }
        break;

      case 'number':
        if (!this.form.values.numberMin && !this.form.values.numberMax) {
          this.form.setFieldValue('numberMin', 0);
          this.form.setFieldValue('numberMax', 99999);
        }
        break;

      case 'date':
        if (!this.form.values.dateTemplate) {
          this.form.setFieldValue('dateTemplate', 'DD-MMM-YYYY');
        }
        break;

      case 'text':
        if (!this.form.values.textMin && !this.form.values.textMax) {
          this.form.setFieldValue('textMin', 1);
          this.form.setFieldValue('textMax', 20);
          this.form.setFieldValue('textMaxLength', 50);
        }
        break;
    }
  }

  public render(): JSX.Element {
    return (
      <div className="form-group row">
        <label className="col-sm-3 col-form-label text-right">{GetMessage('customFields_label_dataType')}</label>
        <div className="col-sm-9">
          <Field name="type">
            {(fieldProps: FieldProps) => {
              this.form = fieldProps.form;

              let className = 'form-control';

              if (fieldProps.meta.touched) {
                if (fieldProps.meta.error) {
                  className += ' is-invalid';
                } else {
                  className += ' is-valid';
                }
              }

              return (
                <select {...fieldProps.field} onChange={this.handleSelectChange} className={className}>
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
              );
            }}
          </Field>
          <ErrorMessage name="type">
            {errorMessage => <div className="invalid-feedback">{errorMessage}</div>}
          </ErrorMessage>
        </div>
      </div>
    );
  }
}

export default DataTypeSelectField;
