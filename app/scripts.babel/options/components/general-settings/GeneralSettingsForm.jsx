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
        <h2>Email Settings</h2>
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
              Test Me
            </button>
            {' '}
            {this.state.emailSample}
          </div>
        </div>
        <h2>Password Settings</h2>
        <Fields
          names={['passwordSettings.mode', 'passwordSettings.password']}
          component={PasswordSettingsField}
        />
        <h2>Field Options</h2>
        <div className="form-group">
          <label className="control-label col-sm-3">Ignore Fields Match</label>
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
              label="Ignore all hidden/invisible fields"
            />
            <Field
              name="ignoreFieldsWithContent"
              component={toggleInput}
              type="checkbox"
              label="Ignore fields that already have content"
            />
            <div className="help-block">
              <span className="label label-info">Note</span> Inputs
              with <i>type=&quot;hidden&quot;</i> are always ignored.
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Confirmation Fields Match</label>
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
              Data entered in a preceding input field will be used for inputs
              matching any of these values.
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Agree to Terms Fields Match</label>
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
              Checkboxes matching any of these values will always be checked.
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
        <h2>General Settings</h2>
        <div className="form-group">
          <label className="control-label col-sm-3">Trigger Events</label>
          <div className="col-sm-9">
            <Field
              name="triggerClickEvents"
              component={toggleInput}
              type="checkbox"
              label="Trigger click/change events on input fields"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Context Menu</label>
          <div className="col-sm-9">
            <Field
              name="enableContextMenu"
              component={toggleInput}
              type="checkbox"
              label="Add items to the right click menu"
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
              Save Settings
            </button>
            <button
              type="button"
              className="btn btn-link"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Reset
            </button>
            { showSavedMessage && <span className="saved-msg">Saved settings.</span> }
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
