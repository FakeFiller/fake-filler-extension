import { useField } from "formik";
import React from "react";

type Props = {
  label: string;
  name: string;
  title?: string;
  helpText?: string | React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const CheckboxField = React.forwardRef((props: Props, ref: React.Ref<HTMLInputElement>) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });
  const { name, id, label, helpText, className, title, ...rest } = props;

  let validationCssClass = "";

  if (meta.touched) {
    if (meta.error) {
      validationCssClass = "is-invalid";
    }
  }

  const componentId = id || name;

  const controlMarkup = (
    <div className={`custom-control custom-switch ${className}`}>
      <input
        id={componentId}
        type="checkbox"
        ref={ref}
        className={`custom-control-input ${validationCssClass}`}
        {...field}
        {...rest}
      />
      <label htmlFor={componentId} className="custom-control-label">
        {label}
      </label>
      {helpText && <small className="form-text text-muted">{helpText}</small>}
      {meta.touched && meta.error ? <div className="invalid-feedback">{meta.error}</div> : null}
    </div>
  );

  if (title) {
    return (
      <div className="form-group row">
        <div className="col-sm-3 text-sm-right">{title}</div>
        <div className="col-sm-9">{controlMarkup}</div>
      </div>
    );
  }

  return controlMarkup;
});

export default CheckboxField;
