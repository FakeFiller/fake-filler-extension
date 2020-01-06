import { useField } from 'formik';
import * as React from 'react';

type Props = {
  label: string;
  name: string;
  title?: string;
  helpText?: string | React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CheckboxField = React.forwardRef((props: Props, ref: React.Ref<HTMLInputElement>) => {
  const [field, meta] = useField(props);
  const { name, id, label, helpText, className, title, ...rest } = props;

  let validationCssClass = '';

  if (meta.touched) {
    if (meta.error) {
      validationCssClass = 'is-invalid';
    }
  }

  const componentId = id || name;

  const controlMarkup = (
    <div className={`form-check ${className}`}>
      <input
        name={name}
        id={componentId}
        type="checkbox"
        ref={ref}
        className={`form-check-input ${validationCssClass}`}
        {...field}
        {...rest}
      />
      <label htmlFor={componentId} className="form-check-label">
        {label}
      </label>
      {helpText && <div className="form-text text-muted">{helpText}</div>}
      {meta.touched && meta.error ? <div className="invalid-feedback">{meta.error}</div> : null}
    </div>
  );

  if (title) {
    return (
      <div className="form-group row">
        <div className="col-sm-3 text-right">{title}</div>
        <div className="col-sm-9">{controlMarkup}</div>
      </div>
    );
  }

  return controlMarkup;
});

CheckboxField.defaultProps = {
  type: 'checkbox',
};

export default CheckboxField;
