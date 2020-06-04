import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import React from "react";

import { GetMessage } from "src/common/helpers";
import CheckboxField from "src/options/components/common/CheckboxField";
import HtmlPhrase from "src/options/components/common/HtmlPhrase";
import RadioButtonField from "src/options/components/common/RadioButtonField";
import TextField from "src/options/components/common/TextField";
import { IFormFillerOptionsForm, IFormFillerOptions } from "src/types";

const validate = (values: IFormFillerOptionsForm): FormikErrors<IFormFillerOptionsForm> => {
  const errors: FormikErrors<IFormFillerOptionsForm> = {};

  if (values.emailSettingsUsernameType === "list" && !values.emailSettingsUsernameList) {
    errors.emailSettingsUsernameList = GetMessage("generalSettings_validation_enterUsernames");
  }

  if (values.emailSettingsUsernameType === "regex" && !values.emailSettingsUsernameRegEx) {
    errors.emailSettingsUsernameRegEx = GetMessage("generalSettings_validation_enterRegEx");
  }

  if (values.emailSettingsHostnameType === "list" && !values.emailSettingsHostnameList) {
    errors.emailSettingsHostnameList = GetMessage("generalSettings_validation_enterHostname");
  }

  if (values.passwordSettingsMode === "defined" && !values.passwordSettingsPassword) {
    errors.passwordSettingsPassword = GetMessage("generalSettings_validation_enterPassword");
  }

  if (
    !values.fieldMatchId &&
    !values.fieldMatchName &&
    !values.fieldMatchLabel &&
    !values.fieldMatchClass &&
    !values.fieldMatchPlaceholder
  ) {
    errors.fieldMatchId = GetMessage("generalSettings_validation_enterAtLeastOneMatch");
  }

  if (!values.defaultMaxLength || values.defaultMaxLength.length === 0) {
    errors.defaultMaxLength = GetMessage("generalSettings_validation_invalidDefaultMaxLength");
  }

  if (values.defaultMaxLength && parseInt(values.defaultMaxLength, 10) < 1) {
    errors.defaultMaxLength = GetMessage("generalSettings_validation_invalidDefaultMaxLength");
  }

  return errors;
};

type Props = {
  options: IFormFillerOptions;
  showSavedMessage: boolean;
  onSave: (formValues: IFormFillerOptionsForm) => void;
};

const GeneralSettingsForm = (props: Props) => {
  function handleSubmit(values: IFormFillerOptionsForm, actions: FormikHelpers<IFormFillerOptionsForm>) {
    actions.setSubmitting(true);
    props.onSave(values);
    actions.setSubmitting(false);
  }

  const initialValues: Partial<IFormFillerOptionsForm> = {};

  initialValues.agreeTermsFields = props.options.agreeTermsFields.join(", ");
  initialValues.confirmFields = props.options.confirmFields.join(", ");
  initialValues.defaultMaxLength = String(props.options.defaultMaxLength);
  initialValues.enableContextMenu = props.options.enableContextMenu;
  initialValues.ignoreFieldsWithContent = props.options.ignoreFieldsWithContent;
  initialValues.ignoreHiddenFields = props.options.ignoreHiddenFields;
  initialValues.ignoredFields = props.options.ignoredFields.join(", ");
  initialValues.triggerClickEvents = props.options.triggerClickEvents;
  initialValues.passwordSettingsMode = props.options.passwordSettings.mode;
  initialValues.passwordSettingsPassword = props.options.passwordSettings.password;
  initialValues.fieldMatchId = props.options.fieldMatchSettings.matchId;
  initialValues.fieldMatchName = props.options.fieldMatchSettings.matchName;
  initialValues.fieldMatchLabel = props.options.fieldMatchSettings.matchLabel;
  initialValues.fieldMatchClass = props.options.fieldMatchSettings.matchClass;
  initialValues.fieldMatchPlaceholder = props.options.fieldMatchSettings.matchPlaceholder;
  initialValues.emailSettingsHostnameType = props.options.emailSettings.hostname;
  initialValues.emailSettingsHostnameList = props.options.emailSettings.hostnameList.join(", ");
  initialValues.emailSettingsUsernameType = props.options.emailSettings.username;
  initialValues.emailSettingsUsernameList = props.options.emailSettings.usernameList.join(", ");
  initialValues.emailSettingsUsernameRegEx = props.options.emailSettings.usernameRegEx;

  return (
    <Formik
      initialValues={initialValues as IFormFillerOptionsForm}
      enableReinitialize
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <h2>{GetMessage("generalSettings_emailSettings")}</h2>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-sm-right pt-0" htmlFor="emailSettingsUsernameType">
              {GetMessage("generalSettings_label_username")}
            </label>
            <div className="col-sm-9">
              <RadioButtonField
                name="emailSettingsUsernameType"
                value="username"
                label={GetMessage("generalSettings_label_username_usernameLabel")}
              />
              <RadioButtonField
                name="emailSettingsUsernameType"
                value="name"
                label={GetMessage("generalSettings_label_username_nameLabel")}
              />
              <RadioButtonField
                name="emailSettingsUsernameType"
                value="random"
                label={GetMessage("generalSettings_label_username_randomLabel")}
              />
              <RadioButtonField
                name="emailSettingsUsernameType"
                value="list"
                label={GetMessage("generalSettings_label_username_listLabel")}
              />
              <TextField name="emailSettingsUsernameList" placeholder={GetMessage("enterCsv")} />
              <RadioButtonField
                name="emailSettingsUsernameType"
                value="regex"
                label={GetMessage("generalSettings_label_username_regExTextPlaceholder")}
              />
              <TextField name="emailSettingsUsernameRegEx" placeholder={GetMessage("enterCsv")} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-sm-right pt-0" htmlFor="emailSettingsHostnameType">
              {GetMessage("generalSettings_label_hostName")}
            </label>
            <div className="col-sm-9">
              <RadioButtonField
                name="emailSettingsHostnameType"
                value="random"
                label={GetMessage("generalSettings_label_hostName_randomLabel")}
              />
              <RadioButtonField
                name="emailSettingsHostnameType"
                value="list"
                label={GetMessage("generalSettings_label_hostName_listLabel")}
              />
              <TextField
                name="emailSettingsHostnameList"
                placeholder={GetMessage("enterCsv")}
                helpText={GetMessage("generalSettings_label_hostName_listTextHelp")}
              />
            </div>
          </div>

          <h2>{GetMessage("generalSettings_passwordSettings")}</h2>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-sm-right pt-0" htmlFor="passwordSettingsMode">
              {GetMessage("generalSettings_password")}
            </label>
            <div className="col-sm-9">
              <RadioButtonField
                name="passwordSettingsMode"
                value="random"
                label={GetMessage("generalSettings_password_randomLabel")}
              />
              <RadioButtonField
                name="passwordSettingsMode"
                value="defined"
                label={GetMessage("generalSettings_password_useThisLabel")}
              />
              <TextField name="passwordSettingsPassword" />
            </div>
          </div>

          <h2>{GetMessage("generalSettings_fieldOptions")}</h2>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="ignoredFields">
              {GetMessage("generalSettings_ignoreFieldsMatch")}
            </label>
            <div className="col-sm-9">
              <TextField name="ignoredFields" placeholder={GetMessage("enterCsv")} />
              <CheckboxField name="ignoreHiddenFields" label={GetMessage("generalSettings_ignoreHiddenFieldsLabel")} />
              <CheckboxField
                name="ignoreFieldsWithContent"
                label={GetMessage("generalSettings_ignoreFieldsWithContentLabel")}
              />
              <HtmlPhrase
                phrase={GetMessage("generalSettings_ignoreFieldsWithContentHelp")}
                as="div"
                className="form-text text-muted"
              />
            </div>
          </div>

          <TextField
            name="confirmFields"
            label={GetMessage("generalSettings_confirmationFieldsMatch")}
            placeholder={GetMessage("enterCsv")}
            helpText={GetMessage("generalSettings_confirmFieldsHelp")}
          />

          <TextField
            name="agreeTermsFields"
            label={GetMessage("generalSettings_agreeToTermsMatch")}
            placeholder={GetMessage("enterCsv")}
            helpText={GetMessage("generalSettings_agreeToTermsMatchHelp")}
          />

          <div className="form-group row">
            <div className="col-sm-3 text-sm-right pt-0">{GetMessage("generalSettings_matchFieldsUsing")}</div>
            <div className="col-sm-9">
              <CheckboxField name="fieldMatchId" label={GetMessage("generalSettings_matchFields_useId")} />
              <CheckboxField name="fieldMatchName" label={GetMessage("generalSettings_matchFields_useName")} />
              <CheckboxField name="fieldMatchLabel" label={GetMessage("generalSettings_matchFields_useLabel")} />
              <CheckboxField name="fieldMatchClass" label={GetMessage("generalSettings_matchFields_useClass")} />
              <CheckboxField
                name="fieldMatchPlaceholder"
                label={GetMessage("generalSettings_matchFields_usePlaceholder")}
              />
              <div className="form-text text-muted">{GetMessage("generalSettings_matchFields_help")}</div>
            </div>
          </div>

          <TextField
            name="defaultMaxLength"
            type="number"
            label={GetMessage("generalSettings_defaultMaxLength")}
            helpText={GetMessage("generalSettings_defaultMaxLength_help")}
          />

          <h2>{GetMessage("generalSettings")}</h2>
          <CheckboxField
            name="triggerClickEvents"
            label={GetMessage("generalSettings_triggerEventsLabel")}
            title={GetMessage("generalSettings_triggerEvents")}
          />
          <CheckboxField
            name="enableContextMenu"
            label={GetMessage("generalSettings_contextMenuLabel")}
            title={GetMessage("generalSettings_contextMenu")}
          />

          <div className="row">
            <div className="col-sm-3">&nbsp;</div>
            <div className="col-sm-9">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
                {GetMessage("saveSettings")}
              </button>
              {props.showSavedMessage && (
                <span className="saved-msg">{GetMessage("generalSettings_settingsSaved")}</span>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default GeneralSettingsForm;
