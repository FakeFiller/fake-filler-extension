import { Form, Formik, FormikActions, FormikErrors } from 'formik';
import * as React from 'react';

import { GetHtmlMarkup, GetMessage } from '../../../common/helpers';
import CheckboxField from '../common/CheckboxField';
import RadioButtonField from '../common/RadioButtonField';
import TextField from '../common/TextField';

const validate = (values: IFormFillerOptionsForm): FormikErrors<IFormFillerOptionsForm> => {
  const errors: FormikErrors<IFormFillerOptionsForm> = {};

  if (values.emailSettingsUsernameType === 'list' && !values.emailSettingsUsernameList) {
    errors.emailSettingsUsernameList = GetMessage('generalSettings_validation_enterUsernames');
  }

  if (values.emailSettingsUsernameType === 'regex' && !values.emailSettingsUsernameRegEx) {
    errors.emailSettingsUsernameRegEx = GetMessage('generalSettings_validation_enterRegEx');
  }
  
  if (values.emailSettingsUsernameType === 'timestamp' && !values.emailSettingsUsernameTimestamp) {
    errors.emailSettingsUsernameTimestamp = GetMessage('generalSettings_validation_enterUsernameTimestamp');
  }

  if (values.emailSettingsHostnameType === 'list' && !values.emailSettingsHostnameList) {
    errors.emailSettingsHostnameList = GetMessage('generalSettings_validation_enterHostname');
  }

  if (values.passwordSettingsMode === 'defined' && !values.passwordSettingsPassword) {
    errors.passwordSettingsPassword = GetMessage('generalSettings_validation_enterPassword');
  }

  if (
    !values.fieldMatchId &&
    !values.fieldMatchName &&
    !values.fieldMatchLabel &&
    !values.fieldMatchClass &&
    !values.fieldMatchPlaceholder
  ) {
    errors.fieldMatchId = GetMessage('generalSettings_validation_enterAtLeastOneMatch');
  }

  if (!values.defaultMaxLength || values.defaultMaxLength.length === 0) {
    errors.defaultMaxLength = GetMessage('generalSettings_validation_invalidDefaultMaxLength');
  }

  if (values.defaultMaxLength && parseInt(values.defaultMaxLength, 10) < 1) {
    errors.defaultMaxLength = GetMessage('generalSettings_validation_invalidDefaultMaxLength');
  }

  return errors;
};

interface IOwnProps {
  options: IFormFillerOptions;
  showSavedMessage: boolean;
  onSave: (formValues: IFormFillerOptionsForm) => void;
}

class GeneralSettingsForm extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleSubmit(values: IFormFillerOptionsForm, actions: FormikActions<IFormFillerOptionsForm>): void {
    this.props.onSave(values);
    actions.setSubmitting(false);
  }

  public render(): JSX.Element {
    const initialValues: Partial<IFormFillerOptionsForm> = {};

    initialValues.agreeTermsFields = this.props.options.agreeTermsFields.join(', ');
    initialValues.confirmFields = this.props.options.confirmFields.join(', ');
    initialValues.defaultMaxLength = String(this.props.options.defaultMaxLength);
    initialValues.enableContextMenu = this.props.options.enableContextMenu;
    initialValues.ignoreFieldsWithContent = this.props.options.ignoreFieldsWithContent;
    initialValues.ignoreHiddenFields = this.props.options.ignoreHiddenFields;
    initialValues.ignoredFields = this.props.options.ignoredFields.join(', ');
    initialValues.triggerClickEvents = this.props.options.triggerClickEvents;
    initialValues.passwordSettingsMode = this.props.options.passwordSettings.mode;
    initialValues.passwordSettingsPassword = this.props.options.passwordSettings.password;
    initialValues.fieldMatchId = this.props.options.fieldMatchSettings.matchId;
    initialValues.fieldMatchName = this.props.options.fieldMatchSettings.matchName;
    initialValues.fieldMatchLabel = this.props.options.fieldMatchSettings.matchLabel;
    initialValues.fieldMatchClass = this.props.options.fieldMatchSettings.matchClass;
    initialValues.fieldMatchPlaceholder = this.props.options.fieldMatchSettings.matchPlaceholder;
    initialValues.emailSettingsHostnameType = this.props.options.emailSettings.hostname;
    initialValues.emailSettingsHostnameList = this.props.options.emailSettings.hostnameList.join(', ');
    initialValues.emailSettingsUsernameType = this.props.options.emailSettings.username;
    initialValues.emailSettingsUsernameList = this.props.options.emailSettings.usernameList.join(', ');
    initialValues.emailSettingsUsernameRegEx = this.props.options.emailSettings.usernameRegEx;
    initialValues.emailSettingsUsernameTimestamp = this.props.options.emailSettings.usernameTimestamp;

    return (
      <Formik
        initialValues={initialValues as IFormFillerOptionsForm}
        enableReinitialize
        validate={validate}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <h2>{GetMessage('generalSettings_emailSettings')}</h2>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label text-right pt-0">
                {GetMessage('generalSettings_label_username')}
              </label>
              <div className="col-sm-9">
                <RadioButtonField
                  name="emailSettingsUsernameType"
                  value="username"
                  label={GetMessage('generalSettings_label_username_usernameLabel')}
                />
                <RadioButtonField
                  name="emailSettingsUsernameType"
                  value="name"
                  label={GetMessage('generalSettings_label_username_nameLabel')}
                />
                <RadioButtonField
                  name="emailSettingsUsernameType"
                  value="random"
                  label={GetMessage('generalSettings_label_username_randomLabel')}
                />
                <RadioButtonField
                  name="emailSettingsUsernameType"
                  value="list"
                  label={GetMessage('generalSettings_label_username_listLabel')}
                />
                <TextField name="emailSettingsUsernameList" placeholder={GetMessage('enterCsv')} />
                <RadioButtonField
                  name="emailSettingsUsernameType"
                  value="regex"
                  label={GetMessage('generalSettings_label_username_regExTextPlaceholder')}
                />
                <TextField name="emailSettingsUsernameRegEx" placeholder={GetMessage('enterCsv')} />
                <RadioButtonField
                  name="emailSettingsUsernameType"
                  value="timestamp"
                  label={GetMessage('generalSettings_label_username_timestampLabel')}
                />
                <div className="form-text text-muted">
                  <span
                    dangerouslySetInnerHTML={GetHtmlMarkup(GetMessage('generalSettings_label_username_timestampLabelHelp'))}
                  />
                </div>
                <TextField name="emailSettingsUsernameTimestamp" placeholder={GetMessage('enterName')} />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-3 col-form-label text-right pt-0">
                {GetMessage('generalSettings_label_hostName')}
              </label>
              <div className="col-sm-9">
                <RadioButtonField
                  name="emailSettingsHostnameType"
                  value="random"
                  label={GetMessage('generalSettings_label_hostName_randomLabel')}
                />
                <RadioButtonField
                  name="emailSettingsHostnameType"
                  value="list"
                  label={GetMessage('generalSettings_label_hostName_listLabel')}
                />
                <TextField
                  name="emailSettingsHostnameList"
                  placeholder={GetMessage('enterCsv')}
                  helpText={GetMessage('generalSettings_label_hostName_listTextHelp')}
                />
              </div>
            </div>

            <h2>{GetMessage('generalSettings_passwordSettings')}</h2>

            <div className="form-group row">
              <label className="col-sm-3 col-form-label text-right pt-0">
                {GetMessage('generalSettings_password')}
              </label>
              <div className="col-sm-9">
                <RadioButtonField
                  name="passwordSettingsMode"
                  value="random"
                  label={GetMessage('generalSettings_password_randomLabel')}
                />
                <RadioButtonField
                  name="passwordSettingsMode"
                  value="defined"
                  label={GetMessage('generalSettings_password_useThisLabel')}
                />
                <TextField name="passwordSettingsPassword" />
              </div>
            </div>

            <h2>{GetMessage('generalSettings_fieldOptions')}</h2>

            <div className="form-group row">
              <label className="col-sm-3 col-form-label text-right">
                {GetMessage('generalSettings_ignoreFieldsMatch')}
              </label>
              <div className="col-sm-9">
                <TextField name="ignoredFields" placeholder={GetMessage('enterCsv')} />
                <CheckboxField
                  name="ignoreHiddenFields"
                  label={GetMessage('generalSettings_ignoreHiddenFieldsLabel')}
                />
                <CheckboxField
                  name="ignoreFieldsWithContent"
                  label={GetMessage('generalSettings_ignoreFieldsWithContentLabel')}
                />
                <div className="form-text text-muted">
                  <span
                    dangerouslySetInnerHTML={GetHtmlMarkup(GetMessage('generalSettings_ignoreFieldsWithContentHelp'))}
                  />
                </div>
              </div>
            </div>

            <TextField
              name="confirmFields"
              label={GetMessage('generalSettings_confirmationFieldsMatch')}
              placeholder={GetMessage('enterCsv')}
              helpText={GetMessage('generalSettings_confirmFieldsHelp')}
            />

            <TextField
              name="agreeTermsFields"
              label={GetMessage('generalSettings_agreeToTermsMatch')}
              placeholder={GetMessage('enterCsv')}
              helpText={GetMessage('generalSettings_agreeToTermsMatchHelp')}
            />

            <div className="form-group row">
              <div className="col-sm-3 text-right pt-0">{GetMessage('generalSettings_matchFieldsUsing')}</div>
              <div className="col-sm-9">
                <CheckboxField name="fieldMatchId" label={GetMessage('generalSettings_matchFields_useId')} />
                <CheckboxField name="fieldMatchName" label={GetMessage('generalSettings_matchFields_useName')} />
                <CheckboxField name="fieldMatchLabel" label={GetMessage('generalSettings_matchFields_useLabel')} />
                <CheckboxField name="fieldMatchClass" label={GetMessage('generalSettings_matchFields_useClass')} />
                <CheckboxField
                  name="fieldMatchPlaceholder"
                  label={GetMessage('generalSettings_matchFields_usePlaceholder')}
                />
                <div className="form-text text-muted">{GetMessage('generalSettings_matchFields_help')}</div>
              </div>
            </div>

            <TextField
              name="defaultMaxLength"
              type="number"
              label={GetMessage('generalSettings_defaultMaxLength')}
              helpText={GetMessage('generalSettings_defaultMaxLength_help')}
            />

            <h2>{GetMessage('generalSettings')}</h2>
            <CheckboxField
              name="triggerClickEvents"
              label={GetMessage('generalSettings_triggerEventsLabel')}
              title={GetMessage('generalSettings_triggerEvents')}
            />
            <CheckboxField
              name="enableContextMenu"
              label={GetMessage('generalSettings_contextMenuLabel')}
              title={GetMessage('generalSettings_contextMenu')}
            />

            <div className="row">
              <div className="col-sm-3">&nbsp;</div>
              <div className="col-sm-9">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
                  {GetMessage('saveSettings')}
                </button>
                {this.props.showSavedMessage && (
                  <span className="saved-msg">{GetMessage('generalSettings_settingsSaved')}</span>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default GeneralSettingsForm;
