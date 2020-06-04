import { useField } from "formik";
import React from "react";

type Props = {
  name: string;
  label?: string;
  helpText?: string | React.ReactNode;
} & React.InputHTMLAttributes<HTMLSelectElement>;

const SelectField = React.forwardRef((props: Props, ref: React.Ref<HTMLSelectElement>) => {
  const [field, meta] = useField(props);
  const { name, id, label, helpText, className, ...rest } = props;

  let controlCssClass = "custom-select";

  if (meta.touched) {
    if (meta.error) {
      controlCssClass += " is-invalid";
    }
  }

  if (className) {
    controlCssClass += ` ${className}`;
  }

  const controlMarkup = (
    <>
      <select id={id || name} className={controlCssClass} ref={ref} {...field} {...rest} />
      {helpText && <small className="form-text text-muted">{helpText}</small>}
      {meta.touched && meta.error ? <div className="invalid-feedback">{meta.error}</div> : null}
    </>
  );

  if (label) {
    return (
      <div className="form-group row">
        <label className="col-sm-3 col-form-label text-sm-right" htmlFor={name}>
          {label}
        </label>
        <div className="col-sm-9">{controlMarkup}</div>
      </div>
    );
  }

  return controlMarkup;
});

export default SelectField;
