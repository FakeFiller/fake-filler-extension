import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, Fields, reduxForm, formValueSelector } from 'redux-form';

import { CsvToArray } from '../../../form-filler/helpers';
import DataGenerator from '../../../form-filler/data-generator';
import toggleInput from '../shared/ToggleInput';
import EmailUsernameField from './EmailUsernameField';
import EmailHostnameField from './EmailHostnameField';
import PasswordSettingsField from './PasswordSettingsField';
import MatchFieldsToggleField from './MatchFieldsToggleField';
import language from '../../../form-filler/language';

const validate = (values) => {
  const errors = {
    emailSettings: {},
    passwordSettings: {},
    fieldMatchSettings: {},
  };

  if (values.emailSettings) {
    if (values.emailSettings.username === 'list' && !values.emailSettings.usernameList) {
      errors.emailSettings.usernameList = 'Please enter a list of usernames.';
    }

    if (values.emailSettings.username === 'regex' && !values.emailSettings.usernameRegEx) {
      errors.emailSettings.usernameRegEx = 'Please enter a regular expression.';
    }

    if (values.emailSettings.hostname === 'list' && !values.emailSettings.hostnameList) {
      errors.emailSettings.hostnameList = 'Please enter a list of hostnames.';
    }
  }

  if (values.passwordSettings) {
    if (values.passwordSettings.mode === 'defined' && !values.passwordSettings.password) {
      errors.passwordSettings.password = 'Please enter a password.';
    }
  }

  if (values.fieldMatchSettings) {
    if (!values.fieldMatchSettings.matchLabel
      && !values.fieldMatchSettings.matchId
      && !values.fieldMatchSettings.matchName
      && !values.fieldMatchSettings.matchClass
    ) {
      errors.fieldMatchSettings.matchId = 'You must select at least one option.';
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
        <h2>{language("emailSetting")}</h2>
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
                {language("testMe")}
            </button>
            {' '}
            {this.state.emailSample}
          </div>
        </div>
        <h2>{language("passwordSetting")}</h2>
        <Fields
          names={['passwordSettings.mode', 'passwordSettings.password']}
          component={PasswordSettingsField}
        />
        <h2>{language("fieldOptions")}</h2>
        <div className="form-group">
          <label className="control-label col-sm-3">{language("ignoreMatch")}</label>
          <div className="col-sm-9">
            <Field
              name="ignoredFields"
              type="text"
              component="input"
              className="form-control"
              autoComplete="off"
              placeholder="Enter comma-separated values."
            />
            <Field
              name="ignoreHiddenFields"
              component={toggleInput}
              type="checkbox"
              label={language("ignoreHidden")}
            />
            <Field
              name="ignoreFieldsWithContent"
              component={toggleInput}
              type="checkbox"
              label={language("ignoreExist")}
            />
            <div className="help-block">
              <span className="label label-info">{language("note")}</span>
              <span dangerouslySetInnerHTML={{__html: language("ignoreFile")}}></span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">{language("confirmation")}</label>
          <div className="col-sm-9">
            <Field
              name="confirmFields"
              type="text"
              component="input"
              className="form-control"
              autoComplete="off"
              placeholder="Enter comma-separated values."
            />
            <div className="help-block">
                {language("matchTip")}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">{language("agreeFieldMatch")}</label>
          <div className="col-sm-9">
            <Field
              name="agreeTermsFields"
              type="text"
              component="input"
              className="form-control"
              autoComplete="off"
              placeholder="Enter comma-separated values."
            />
            <div className="help-block">
                {language("agreeFieldMatchTip")}
            </div>
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
        <h2>{language("generalSetting")}</h2>
        <div className="form-group">
          <label className="control-label col-sm-3">{language("trigger")}</label>
          <div className="col-sm-9">
            <Field
              name="triggerClickEvents"
              component={toggleInput}
              type="checkbox"
              label={language("triggerLabel")}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">{language("contextMenu")}</label>
          <div className="col-sm-9">
            <Field
              name="enableContextMenu"
              component={toggleInput}
              type="checkbox"
              label={language("clickMenu")}
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
                {language("saveSetting")}
            </button>
            <button
              type="button"
              className="btn btn-link"
              disabled={pristine || submitting}
              onClick={reset}
            >
                {language("reset")}
            </button>
            { showSavedMessage && <span className="saved-msg">{language("saveSetting")}</span> }
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
