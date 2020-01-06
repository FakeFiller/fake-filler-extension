import { useField } from 'formik';
import React from 'react';

type Props = {
  name: string;
  label?: string;
  helpText?: string | React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextField = React.forwardRef((props: Props, ref: React.Ref<HTMLInputElement>) => {
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
    <React.Fragment>
      <input name={name} id={id || name} ref={ref} className={controlCssClass} {...field} {...rest} />
      {helpText && <div className="form-text text-muted">{helpText}</div>}
      {meta.touched && meta.error ? <div className="invalid-feedback">{meta.error}</div> : null}
    </React.Fragment>
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

TextField.defaultProps = {
  type: 'text',
};

export default TextField;
