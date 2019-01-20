import { ErrorMessage, Field, FieldProps } from 'formik';
import * as React from 'react';

interface IOwnProps {
  label: string;
  name: string;
  title?: string;
  helpText?: string | React.ReactNode;
}

class CheckboxField extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.renderCheckbox = this.renderCheckbox.bind(this);
  }

  private renderCheckbox(fieldProps: FieldProps<ICustomFieldForm>): JSX.Element {
    // @ts-ignore
    const hasError = !!fieldProps.form.errors[fieldProps.field.name];
    // @ts-ignore
    const isTouched = !!fieldProps.form.touched[fieldProps.field.name];

    let className = '';

    if (isTouched) {
      if (hasError) {
        className += ' is-invalid';
      }
    }

    const isChecked = !!fieldProps.field.value;

    return (
      <>
        <input
          {...fieldProps.field}
          type="checkbox"
          id={this.props.name}
          className={`form-check-input ${className}`}
          checked={isChecked}
          onChange={fieldProps.form.handleChange}
        />
        <label className={`form-check-label ${className}`} htmlFor={this.props.name}>
          {this.props.label}
        </label>
      </>
    );
  }

  public render(): JSX.Element {
    const controlMarkup = (
      <div className="form-check">
        <Field name={this.props.name} render={this.renderCheckbox} />
        {this.props.helpText && <div className="form-text text-muted">{this.props.helpText}</div>}
        <ErrorMessage name={this.props.name}>
          {errorMessage => <div className="invalid-feedback">{errorMessage}</div>}
        </ErrorMessage>
      </div>
    );

    if (this.props.title) {
      return (
        <div className="form-group row">
          <div className="col-sm-3 text-right">{this.props.title}</div>
          <div className="col-sm-9">{controlMarkup}</div>
        </div>
      );
    }

    return controlMarkup;
  }
}

export default CheckboxField;
