import { useField } from 'formik';
import React from 'react';

type Props = {
  name: string;
  label?: string;
  helpText?: string | React.ReactNode;
} & React.InputHTMLAttributes<HTMLTextAreaElement>;

const TextAreaField = React.forwardRef((props: Props, ref: React.Ref<HTMLTextAreaElement>) => {
  const [field, meta] = useField(props);
  const { name, id, label, helpText, className, ...rest } = props;

  let controlCssClass = 'form-control';

  if (meta.touched) {
    if (meta.error) {
      controlCssClass += ' is-invalid';
    } else {
      controlCssClass += ' is-valid';
    }
  }

  if (className) {
    controlCssClass += ` ${className}`;
  }

  const controlMarkup = (
    <>
      <textarea name={name} id={id || name} ref={ref} className={controlCssClass} {...field} {...rest} />
      {helpText && <small className="form-text text-muted">{helpText}</small>}
      {meta.touched && meta.error ? <div className="invalid-feedback">{meta.error}</div> : null}
    </>
  );

  if (label) {
    return (
      <div className="form-group row">
        <label htmlFor={id || name} className="col-sm-3 col-form-label text-right">
          {label}
        </label>
        <div className="col-sm-9">{controlMarkup}</div>
      </div>
    );
  }

  return controlMarkup;
});

export default TextAreaField;
