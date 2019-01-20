import { ErrorMessage, Field, FieldProps } from 'formik';
import * as React from 'react';

interface IOwnProps {
  name: string;
  label?: string;
  helpText?: string;
}

class SelectField extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.renderSelect = this.renderSelect.bind(this);
  }

  private renderSelect(fieldProps: FieldProps<ICustomFieldForm>): JSX.Element {
    // @ts-ignore
    const hasError = !!fieldProps.form.errors[fieldProps.field.name];
    // @ts-ignore
    const isTouched = !!fieldProps.form.touched[fieldProps.field.name];

    let className = 'form-control';

    if (isTouched) {
      if (hasError) {
        className += ' is-invalid';
      }
    }

    return (
      <select {...fieldProps.field} id={this.props.name} className={className}>
        {this.props.children}
      </select>
    );
  }

  public render(): JSX.Element {
    const controlMarkup = (
      <>
        <Field name={this.props.name} render={this.renderSelect} />
        {this.props.helpText && <div className="form-text text-muted">{this.props.helpText}</div>}
        <ErrorMessage name={this.props.name}>
          {errorMessage => <div className="invalid-feedback">{errorMessage}</div>}
        </ErrorMessage>
      </>
    );

    if (this.props.label) {
      return (
        <div className="form-group row">
          <label className="col-sm-3 col-form-label text-right" htmlFor={this.props.name}>
            {this.props.label}
          </label>
          <div className="col-sm-9">{controlMarkup}</div>
        </div>
      );
    }

    return controlMarkup;
  }
}

export default SelectField;
