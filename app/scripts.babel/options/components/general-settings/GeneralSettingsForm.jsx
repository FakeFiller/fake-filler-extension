import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, Fields, reduxForm, formValueSelector } from 'redux-form';

import { CsvToArray, GetMessage } from '../../../form-filler/helpers';
import DataGenerator from '../../../form-filler/data-generator';
import toggleInput from '../shared/ToggleInput';
import EmailUsernameField from './EmailUsernameField';
import EmailHostnameField from './EmailHostnameField';
import PasswordSettingsField from './PasswordSettingsField';
import MatchFieldsToggleField from './MatchFieldsToggleField';

const validate = (values) => {
  const errors = {
    emailSettings: {},
    passwordSettings: {},
    fieldMatchSettings: {},
  };

  if (values.emailSettings) {
    if (values.emailSettings.username === 'list' && !values.emailSettings.usernameList) {
      errors.emailSettings.usernameList = GetMessage('generalSettings_validation_enterUsernames');
    }

    if (values.emailSettings.username === 'regex' && !values.emailSettings.usernameRegEx) {
      errors.emailSettings.usernameRegEx = GetMessage('generalSettings_validation_enterRegEx');
    }

    if (values.emailSettings.hostname === 'list' && !values.emailSettings.hostnameList) {
      errors.emailSettings.hostnameList = GetMessage('generalSettings_validation_enterHostname');
    }
  }

  if (values.passwordSettings) {
    if (values.passwordSettings.mode === 'defined' && !values.passwordSettings.password) {
      errors.passwordSettings.password = GetMessage('generalSettings_validation_enterPassword');
    }
  }

  if (values.fieldMatchSettings) {
    if (!values.fieldMatchSettings.matchLabel
      && !values.fieldMatchSettings.matchId
      && !values.fieldMatchSettings.matchName
      && !values.fieldMatchSettings.matchClass
    ) {
      errors.fieldMatchSettings.matchId = GetMessage('generalSettings_validation_enterAtLeastOneMatch');
    }
  }

  return errors;
};

class GeneralSettingsForm extends Component {
  constructor(props) {
    super(props);

    this.generateRandomEmail = this.generateRandomEmail.bind(this);

    this.state = {
      emailSample: '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getHtmlMarkup(markup) {
    return { __html: markup };
  }

  generateRandomEmail() {
    if (this.props.emailSettings) {
      const dataGenerator = new DataGenerator();
      dataGenerator.previousUsername = dataGenerator.generateScrambledWord(5, 10, true);
      dataGenerator.previousFirstName = dataGenerator.generateFirstName();
      dataGenerator.previousLastName = dataGenerator.generateLastName();

      const sanitizedEmailSettings = Object.assign({}, this.props.emailSettings);
      sanitizedEmailSettings.hostnameList = CsvToArray(sanitizedEmailSettings.hostnameList);
      sanitizedEmailSettings.usernameList = CsvToArray(sanitizedEmailSettings.usernameList);

      this.setState({
        emailSample: dataGenerator.generateEmail(sanitizedEmailSettings),
      });
    } else {
      this.setState({
        emailSample: null,
      });
    }
  }

  render() {
    const { handleSubmit, showSavedMessage, pristine, reset, submitting, valid } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <h2>{GetMessage('generalSettings_emailSettings')}</h2>
        <Fields
          names={['emailSettings.username', 'emailSettings.usernameList', 'emailSettings.usernameRegEx']}
          component={EmailUsernameField}
        />
        <Fields
          names={['emailSettings.hostname', 'emailSettings.hostnameList']}
          component={EmailHostnameField}
        />
        <div className="form-group">
          <div className="col-sm-offset-3 col-sm-9">
            <button
              type="button"
              className="btn btn-xs btn-default"
              onClick={this.generateRandomEmail}
            >
              {GetMessage('testMe')}
            </button>
            {' '}
            {this.state.emailSample}
          </div>
        </div>
        <h2>{GetMessage('generalSettings_passwordSettings')}</h2>
        <Fields
          names={['passwordSettings.mode', 'passwordSettings.password']}
          component={PasswordSettingsField}
        />
        <h2>{GetMessage('generalSettings_fieldOptions')}</h2>
        <div className="form-group">
          <label className="control-label col-sm-3">{GetMessage('generalSettings_ignoreFieldsMatch')}</label>
          <div className="col-sm-9">
            <Field
              name="ignoredFields"
              type="text"
              component="input"
              className="form-control"
              autoComplete="off"
              placeholder={GetMessage('enterCsv')}
            />
            <Field
              name="ignoreHiddenFields"
              component={toggleInput}
              type="checkbox"
              label={GetMessage('generalSettings_ignoreHiddenFieldsLabel')}
            />
            <Field
              name="ignoreFieldsWithContent"
              component={toggleInput}
              type="checkbox"
              label={GetMessage('generalSettings_ignoreFieldsWithContentLabel')}
            />
            <div className="help-block">
              <span className="label label-info">{GetMessage('note')}</span>
              <span dangerouslySetInnerHTML={this.getHtmlMarkup(GetMessage('generalSettings_ignoreFieldsWithContentHelp'))} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">{GetMessage('generalSettings_confirmationFieldsMatch')}</label>
          <div className="col-sm-9">
            <Field
              name="confirmFields"
              type="text"
              component="input"
              className="form-control"
              autoComplete="off"
              placeholder={GetMessage('enterCsv')}
            />
            <div className="help-block">{GetMessage('generalSettings_confirmFieldsHelp')}</div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">{GetMessage('generalSettings_agreeToTermsMatch')}</label>
          <div className="col-sm-9">
            <Field
              name="agreeTermsFields"
              type="text"
              component="input"
              className="form-control"
              autoComplete="off"
              placeholder={GetMessage('enterCsv')}
            />
            <div className="help-block">{GetMessage('generalSettings_agreeToTermsMatchHelp')}</div>
          </div>
        </div>
        <Fields
          names={[
            'fieldMatchSettings.matchLabel',
            'fieldMatchSettings.matchId',
            'fieldMatchSettings.matchName',
            'fieldMatchSettings.matchClass',
          ]}
          component={MatchFieldsToggleField}
        />
        <h2>{GetMessage('generalSettings')}</h2>
        <div className="form-group">
          <label className="control-label col-sm-3">{GetMessage('generalSettings_triggerEvents')}</label>
          <div className="col-sm-9">
            <Field
              name="triggerClickEvents"
              component={toggleInput}
              type="checkbox"
              label={GetMessage('generalSettings_triggerEventsLabel')}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">{GetMessage('generalSettings_contextMenu')}</label>
          <div className="col-sm-9">
            <Field
              name="enableContextMenu"
              component={toggleInput}
              type="checkbox"
              label={GetMessage('generalSettings_contextMenuLabel')}
            />
          </div>
        </div>
        <br />
        <div className="form-group">
          <div className="col-sm-offset-3 col-sm-9">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pristine || !valid}
            >
              {GetMessage('saveSettings')}
            </button>
            <button
              type="button"
              className="btn btn-link"
              disabled={pristine || submitting}
              onClick={reset}
            >
              {GetMessage('reset')}
            </button>
            { showSavedMessage && <span className="saved-msg">{GetMessage('generalSettings_settingsSaved')}</span> }
          </div>
        </div>
      </form>
    );
  }
}

GeneralSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  showSavedMessage: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  emailSettings: PropTypes.shape({}),
};

GeneralSettingsForm.defaultProps = {
  emailSettings: null,
};

const FormComponent = reduxForm({
  form: 'settingsForm',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(GeneralSettingsForm);

const selector = formValueSelector('settingsForm');

function mapStateToProps(state) {
  const emailSettings = selector(state, 'emailSettings');

  return {
    emailSettings,
  };
}

const ConnectedFormComponent = connect(mapStateToProps)(FormComponent);

export default ConnectedFormComponent;
