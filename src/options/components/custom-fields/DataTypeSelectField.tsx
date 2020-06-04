import { ErrorMessage, Field, FieldProps, useFormikContext } from "formik";
import * as React from "react";

import { GetMessage } from "src/common/helpers";
import { ICustomFieldForm, CustomFieldTypes } from "src/types";

const DataTypeSelectField = () => {
  const form = useFormikContext<ICustomFieldForm>();

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    form.handleChange(event);

    const value = event.target.value as CustomFieldTypes;

    switch (value) {
      case "telephone":
        if (!form.values.telephoneTemplate) {
          form.setFieldValue("telephoneTemplate", "+1 (XxX) XxX-XxxX");
        }
        break;

      case "number":
        if (!form.values.numberMin && !form.values.numberMax) {
          form.setFieldValue("numberMin", 0);
          form.setFieldValue("numberMax", 99999);
          form.setFieldValue("numberDecimalPlaces", 0);
        }
        break;

      case "date":
        if (!form.values.dateTemplate) {
          form.setFieldValue("dateTemplate", "DD-MMM-YYYY");
        }
        if (!form.values.dateMin && !form.values.dateMinDate) {
          form.setFieldValue("dateMin", "");
          form.setFieldValue("dateMinDate", "1970-01-01");
        }
        if (!form.values.dateMax && !form.values.dateMaxDate) {
          form.setFieldValue("dateMax", 0);
          form.setFieldValue("dateMaxDate", "");
        }
        break;

      case "text":
        if (!form.values.textMin && !form.values.textMax) {
          form.setFieldValue("textMin", 1);
          form.setFieldValue("textMax", 20);
          form.setFieldValue("textMaxLength", 50);
        }
        break;

      default:
        break;
    }
  }

  return (
    <div className="form-group row">
      <label className="col-sm-3 col-form-label text-sm-right" htmlFor="type">
        {GetMessage("customFields_label_dataType")}
      </label>
      <div className="col-sm-9">
        <Field name="type">
          {(fieldProps: FieldProps) => {
            let className = "custom-select";

            if (fieldProps.meta.touched) {
              if (fieldProps.meta.error) {
                className += " is-invalid";
              }
            }

            return (
              <select {...fieldProps.field} onChange={handleSelectChange} className={className}>
                <option value="">{GetMessage("customFields_dataType_select")}</option>
                <optgroup label={GetMessage("customFields_dataType_humanDataLabel")}>
                  <option value="first-name">{GetMessage("customFields_dataType_firstName")}</option>
                  <option value="last-name">{GetMessage("customFields_dataType_lastName")}</option>
                  <option value="full-name">{GetMessage("customFields_dataType_fullName")}</option>
                  <option value="username">{GetMessage("customFields_dataType_username")}</option>
                  <option value="email">{GetMessage("customFields_dataType_emailAddress")}</option>
                  <option value="organization">{GetMessage("customFields_dataType_companyName")}</option>
                  <option value="telephone">{GetMessage("customFields_dataType_telephone")}</option>
                  <option value="number">{GetMessage("customFields_dataType_number")}</option>
                  <option value="date">{GetMessage("customFields_dataType_date")}</option>
                  <option value="url">{GetMessage("customFields_dataType_url")}</option>
                </optgroup>
                <optgroup label={GetMessage("customFields_dataType_otherLabel")}>
                  <option value="text">{GetMessage("customFields_dataType_text")}</option>
                  <option value="alphanumeric">{GetMessage("customFields_dataType_alphaNumeric")}</option>
                  <option value="regex">{GetMessage("customFields_dataType_regEx")}</option>
                  <option value="randomized-list">{GetMessage("customFields_dataType_randomizedList")}</option>
                </optgroup>
              </select>
            );
          }}
        </Field>
        <ErrorMessage name="type">
          {(errorMessage) => <div className="invalid-feedback">{errorMessage}</div>}
        </ErrorMessage>
      </div>
    </div>
  );
};

export default DataTypeSelectField;
