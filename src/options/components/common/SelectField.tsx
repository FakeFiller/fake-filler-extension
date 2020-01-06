import { useField } from 'formik';
import * as React from 'react';

type Props = {
  name: string;
  label?: string;
  helpText?: string | React.ReactNode;
} & React.InputHTMLAttributes<HTMLSelectElement>;

const SelectField = React.forwardRef((props: Props, ref: React.Ref<HTMLSelectElement>) => {
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
      <select name={name} id={id || name} className={controlCssClass} ref={ref} {...field} {...rest} />
      {helpText && <div className="form-text text-muted">{helpText}</div>}
      {meta.touched && meta.error ? <div className="invalid-feedback">{meta.error}</div> : null}
    </>
  );

  if (label) {
    return (
      <div className="form-group row">
        <label className="col-sm-3 col-form-label text-right" htmlFor={name}>
          {label}
        </label>
        <div className="col-sm-9">{controlMarkup}</div>
      </div>
    );
  }

  return controlMarkup;
});

export default SelectField;
