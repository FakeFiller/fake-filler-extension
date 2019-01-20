import { ErrorMessage, Field, FieldProps } from 'formik';
import * as React from 'react';

interface IOwnProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  helpText?: string | React.ReactNode;
}

class TextField extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.renderInput = this.renderInput.bind(this);
  }

  private renderInput(fieldProps: FieldProps<ICustomFieldForm>): JSX.Element {
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

    const fieldType = this.props.type || 'text';

    return (
      <input
        {...fieldProps.field}
        type={fieldType}
        id={this.props.name}
        className={className}
        placeholder={this.props.placeholder}
      />
    );
  }

  public render(): JSX.Element {
    const controlMarkup = (
      <>
        <Field name={this.props.name} render={this.renderInput} />
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

export default TextField;
