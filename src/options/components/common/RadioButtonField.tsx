import { useField } from 'formik';
import * as React from 'react';

import { SanitizeText } from 'src/common/helpers';

type Props = {
  label: string;
  name: string;
  value: string;
  title?: string;
  helpText?: string | React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const RadioButtonField = React.forwardRef((props: Props, ref: React.Ref<HTMLInputElement>) => {
  const [field, meta] = useField(props);
  const { name, type, id, label, helpText, className, value, title, ...rest } = props;

  let validationCssClass = '';

  if (meta.touched) {
    if (meta.error) {
      validationCssClass = 'is-invalid';
    }
  }

  const componentId = `${id || name}_${SanitizeText(value)}`;

  const controlMarkup = (
    <div className={`form-check ${className}`}>
      <input
        name={name}
        id={componentId}
        type="radio"
        ref={ref}
        className={`form-check-input ${validationCssClass}`}
        value={value}
        {...field}
        {...rest}
      />
      <label htmlFor={componentId} className="form-check-label">
        {label}
      </label>
      {helpText && <small className="form-text text-muted">{helpText}</small>}
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

RadioButtonField.defaultProps = {
  type: 'radio',
};

export default RadioButtonField;
