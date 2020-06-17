import { Form, Formik, FormikErrors } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";

import { GetMessage, DEFAULT_EMAIL_CUSTOM_FIELD } from "src/common/helpers";
import TextField from "src/options/components/common/TextField";
import DataTypeSelectField from "src/options/components/custom-fields/DataTypeSelectField";
import AlphanumericOptions from "src/options/components/custom-fields/data-types/AlphanumericOptions";
import DateOptions from "src/options/components/custom-fields/data-types/DateOptions";
import EmailOptions from "src/options/components/custom-fields/data-types/EmailOptions";
import NumberOptions from "src/options/components/custom-fields/data-types/NumberOptions";
import RandomizedListOptions from "src/options/components/custom-fields/data-types/RandomizedListOptions";
import RegExOptions from "src/options/components/custom-fields/data-types/RegExOptions";
import TelephoneOptions from "src/options/components/custom-fields/data-types/TelephoneOptions";
import TextOptions from "src/options/components/custom-fields/data-types/TextOptions";
import { ICustomFieldForm, ICustomField } from "src/types";

const validate = (values: ICustomFieldForm): FormikErrors<ICustomFieldForm> => {
  const errors: FormikErrors<ICustomFieldForm> = {};
  let hasValidType = true;

  if (!values.type) {
    errors.type = GetMessage("customFields_validation_missingType");
    hasValidType = false;
  }

  if (!values.name || values.name.trim().length === 0) {
    errors.name = GetMessage("customFields_validation_missingName");
  }

  if (!values.match || values.match.trim().length === 0) {
    errors.match = GetMessage("customFields_validation_missingMatch");
  }

  if (hasValidType) {
    if (values.type === "telephone" && (!values.telephoneTemplate || values.telephoneTemplate.trim().length === 0)) {
      errors.telephoneTemplate = GetMessage("customFields_validation_missingTelephoneTemplate");
    }

    if (values.type === "number") {
      const minValue = parseInt(values.numberMin, 10);
      if (Number.isNaN(minValue)) {
        errors.numberMin = GetMessage("customFields_validation_missingMinValue");
      }
      if (!values.numberMax) {
        errors.numberMax = GetMessage("customFields_validation_missingMaxValue");
      }
      if (values.numberMin && values.numberMax && parseInt(values.numberMax, 10) < parseInt(values.numberMin, 10)) {
        errors.numberMax = GetMessage("customFields_validation_invalidMinMaxValue");
      }

      const decimalValue = parseInt(values.numberDecimalPlaces, 10);
      if (Number.isNaN(decimalValue)) {
        errors.numberDecimalPlaces = GetMessage("customFields_validation_missingDecimalPlaces");
      }
    }

    if (values.type === "text") {
      if (!values.textMin) {
        errors.textMin = GetMessage("customFields_validation_missingMinValue");
      }
      if (!values.textMax) {
        errors.textMax = GetMessage("customFields_validation_missingMaxValue");
      }
      if (!values.textMaxLength) {
        errors.textMaxLength = GetMessage("customFields_validation_missingMaxLength");
      }
      if (values.textMin && parseInt(values.textMin, 10) < 1) {
        errors.textMin = GetMessage("customFields_validation_invalidMaxValue");
      }
      if (values.textMin && values.textMax && parseInt(values.textMax, 10) < parseInt(values.textMin, 10)) {
        errors.textMax = GetMessage("customFields_validation_invalidMinMaxValue");
      }
      if (values.textMaxLength && parseInt(values.textMaxLength, 10) < 1) {
        errors.textMaxLength = GetMessage("customFields_validation_invalidMaxLengthValue");
      }
    }

    if (values.type === "date") {
      if (!values.dateTemplate || values.dateTemplate.trim().length === 0) {
        errors.dateTemplate = GetMessage("customFields_validation_missingDateTemplate");
      }

      const dateMin = parseInt(values.dateMin, 10);
      const dateMax = parseInt(values.dateMax, 10);
      const dateMinDate = Date.parse(values.dateMinDate);
      const dateMaxDate = Date.parse(values.dateMaxDate);

      if (!Number.isNaN(dateMin) && !Number.isNaN(dateMinDate)) {
        errors.dateMinDate = GetMessage("customFields_validation_onlyOneValueInGroup");
      }

      if (!Number.isNaN(dateMax) && !Number.isNaN(dateMaxDate)) {
        errors.dateMaxDate = GetMessage("customFields_validation_onlyOneValueInGroup");
      }

      if (Number.isNaN(dateMin) && Number.isNaN(dateMinDate)) {
        errors.dateMinDate = GetMessage("customFields_validation_atLeastOneValueInGroup");
      }

      if (Number.isNaN(dateMax) && Number.isNaN(dateMaxDate)) {
        errors.dateMaxDate = GetMessage("customFields_validation_atLeastOneValueInGroup");
      }

      if (!Number.isNaN(dateMin) && !Number.isNaN(dateMax) && dateMin > dateMax) {
        errors.dateMax = GetMessage("customFields_validation_invalidMinMaxValue");
      }

      if (!Number.isNaN(dateMinDate) && !Number.isNaN(dateMaxDate) && dateMinDate > dateMaxDate) {
        errors.dateMaxDate = GetMessage("customFields_validation_invalidMinMaxValue");
      }
    }

    if (values.type === "email") {
      if (!values.emailUsername) {
        errors.emailUsername = GetMessage("customFields_validation_invalidEmailUsername");
      } else if (
        values.emailUsername === "list" &&
        (!values.emailUsernameList || values.emailUsernameList.trim().length === 0)
      ) {
        errors.emailUsernameList = GetMessage("customFields_validation_missingEmailUsernameList");
      } else if (
        values.emailUsername === "regex" &&
        (!values.emailUsernameRegEx || values.emailUsernameRegEx.trim().length === 0)
      ) {
        errors.emailUsernameRegEx = GetMessage("customFields_validation_missingEmailUsernameRegEx");
      }

      if (!values.emailHostname) {
        errors.emailHostname = GetMessage("customFields_validation_invalidEmailHostname");
      } else if (
        values.emailHostname === "list" &&
        (!values.emailHostnameList || values.emailHostnameList.trim().length === 0)
      ) {
        errors.emailHostnameList = GetMessage("customFields_validation_missingEmailHostnameList");
      }
    }

    if (
      values.type === "alphanumeric" &&
      (!values.alphanumericTemplate || values.alphanumericTemplate.trim().length === 0)
    ) {
      errors.alphanumericTemplate = GetMessage("customFields_validation_missingAlNumTemplate");
    }

    if (values.type === "regex" && (!values.regexTemplate || values.regexTemplate.trim().length === 0)) {
      errors.regexTemplate = GetMessage("customFields_validation_missingRegEx");
    }

    if (values.type === "randomized-list" && (!values.list || values.list.trim().length === 0)) {
      errors.list = GetMessage("customFields_validation_missingRandomItems");
    }
  }

  return errors;
};

type Props = {
  customField: ICustomField | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formValues: ICustomFieldForm) => void;
};

const CustomFieldModal = (props: Props) => {
  const { customField } = props;

  const initialValues: Partial<ICustomFieldForm> = {
    match: "",
    name: "",
    numberMin: "",
    numberMax: "",
    numberDecimalPlaces: "",
    textMin: "",
    textMax: "",
    textMaxLength: "",
    telephoneTemplate: "",
    dateTemplate: "",
    dateMin: "",
    dateMax: "",
    dateMinDate: "",
    dateMaxDate: "",
    alphanumericTemplate: "",
    regexTemplate: "",
    list: "",
    emailHostname: "list",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    emailHostnameList: DEFAULT_EMAIL_CUSTOM_FIELD.emailHostnameList!.join(", "),
    emailUsername: "random",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    emailUsernameList: DEFAULT_EMAIL_CUSTOM_FIELD.emailUsernameList!.join(", "),
    emailUsernameRegEx: "",
  };

  if (customField) {
    initialValues.name = customField.name;
    initialValues.type = customField.type;
    initialValues.match = customField.match.join(", ");

    switch (initialValues.type) {
      case "alphanumeric":
        initialValues.alphanumericTemplate = customField.template || "";
        break;

      case "date":
        initialValues.dateTemplate = customField.template || "";

        if (!Number.isNaN(Number(customField.min))) {
          initialValues.dateMin = String(customField.min);
        }

        if (!Number.isNaN(Number(customField.max))) {
          initialValues.dateMax = String(customField.max);
        }

        if (customField.minDate) {
          initialValues.dateMinDate = customField.minDate;
        }

        if (customField.maxDate) {
          initialValues.dateMaxDate = customField.maxDate;
        }
        break;

      case "email": {
        initialValues.emailHostname = customField.emailHostname || "list";
        initialValues.emailHostnameList = customField.emailHostnameList
          ? customField.emailHostnameList.join(", ")
          : initialValues.emailHostnameList;

        initialValues.emailUsername = customField.emailUsername || "list";
        initialValues.emailUsernameRegEx = customField.emailUsernameRegEx || "";
        initialValues.emailUsernameList = customField.emailUsernameList
          ? customField.emailUsernameList.join(", ")
          : initialValues.emailUsernameList;
        break;
      }

      case "number":
        initialValues.numberMax = String(customField.max);
        initialValues.numberMin = String(customField.min);
        initialValues.numberDecimalPlaces = String(customField.decimalPlaces);
        break;

      case "randomized-list":
        initialValues.list = customField.list ? customField.list.join("\n") : "";
        break;

      case "regex":
        initialValues.regexTemplate = customField.template || "";
        break;

      case "telephone":
        initialValues.telephoneTemplate = customField.template || "";
        break;

      case "text":
        initialValues.textMax = String(customField.max);
        initialValues.textMin = String(customField.min);
        initialValues.textMaxLength = String(customField.maxLength);
        break;

      default:
        break;
    }
  }

  return (
    <Modal size="lg" show={props.isOpen} onHide={props.onClose}>
      <Formik initialValues={initialValues as ICustomFieldForm} validate={validate} onSubmit={props.onSave}>
        {({ values, isSubmitting, isValid }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>{GetMessage("customFieldDetails_title")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DataTypeSelectField />
              <TextField name="name" label={GetMessage("customFields_label_friendlyName")} />
              <TextField
                name="match"
                label={GetMessage("customFields_label_match")}
                placeholder={GetMessage("customFields_label_match_placeholder")}
                helpText={GetMessage("customFields_label_match_helpText")}
              />
              {values.type === "alphanumeric" && <AlphanumericOptions />}
              {values.type === "date" && <DateOptions />}
              {values.type === "email" && <EmailOptions {...values} />}
              {values.type === "number" && <NumberOptions />}
              {values.type === "randomized-list" && <RandomizedListOptions />}
              {values.type === "regex" && <RegExOptions regexTemplate={values.regexTemplate} />}
              {values.type === "telephone" && <TelephoneOptions />}
              {values.type === "text" && <TextOptions />}
            </Modal.Body>
            <Modal.Footer>
              <button type="button" className="btn btn-outline-secondary" onClick={props.onClose}>
                {GetMessage("Cancel")}
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
                {GetMessage("Save")}
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CustomFieldModal;
