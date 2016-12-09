import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router';

import toggleInput from '../shared/ToggleInput';

const GeneralSettingsForm = (props) => {
  const { handleSubmit, onReset, showSavedMessage } = props;

  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <h2>Email Settings</h2>
      <div className="form-group">
        <label className="control-label col-sm-3">Username</label>
        <div className="col-sm-9">
          <Field
            name="emailSettings.username"
            component={toggleInput}
            type="radio"
            value="username"
            label="Use a previously generated username"
          />
          <Field
            name="emailSettings.username"
            component={toggleInput}
            type="radio"
            value="name"
            label="Use a previously generated first and last name"
          />
          <Field
            name="emailSettings.username"
            component={toggleInput}
            type="radio"
            value="random"
            label="Use a random name"
          />
          <Field
            name="emailSettings.username"
            component={toggleInput}
            type="radio"
            value="list"
            label="Select from the list below:"
          />
          <Field
            name="emailSettings.usernameList"
            type="text"
            component="input"
            className="form-control"
            autoComplete={false}
          />
          <div className="help-block">
            List each name with a comma.
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-sm-3">Host name</label>
        <div className="col-sm-9">
          <Field
            name="emailSettings.hostname"
            component={toggleInput}
            type="radio"
            value="random"
            label="Use a randomly generated host name"
          />
          <Field
            name="emailSettings.hostname"
            component={toggleInput}
            type="radio"
            value="list"
            label="Select from the list below:"
          />
          <Field
            name="emailSettings.hostnameList"
            type="text"
            component="input"
            className="form-control"
            autoComplete={false}
          />
          <div className="help-block">
            List each name with a comma. You may include the @ sign as well.
          </div>
        </div>
      </div>
      <h2>Password Settings</h2>
      <div className="form-group">
        <label className="control-label col-sm-3">Password</label>
        <div className="col-sm-9">
          <Field
            name="passwordSettings.mode"
            component={toggleInput}
            type="radio"
            value="random"
            label="Generate a random 8 character password (is logged in the console)"
          />
          <Field
            name="passwordSettings.mode"
            component={toggleInput}
            type="radio"
            value="defined"
            label="Use this:"
          />
          <Field
            name="passwordSettings.password"
            type="text"
            component="input"
            className="form-control"
            autoComplete={false}
          />
        </div>
      </div>
      <h2>Field Options</h2>
      <div className="form-group">
        <label className="control-label col-sm-3">Ignore Fields Match</label>
        <div className="col-sm-9">
          <Field
            name="ignoredFields"
            type="text"
            component="input"
            className="form-control"
            autoComplete={false}
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
            autoComplete={false}
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
            autoComplete={false}
          />
          <div className="help-block">
            Checkboxes matching any of these values will always be checked.
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-sm-3">Match Fields Using</label>
        <div className="col-sm-9">
          <Field
            name="fieldMatchSettings.matchLabel"
            component={toggleInput}
            type="checkbox"
            label="Label text for the input tag"
          />
          <Field
            name="fieldMatchSettings.matchId"
            component={toggleInput}
            type="checkbox"
            label="ID attribute of the input tag"
          />
          <Field
            name="fieldMatchSettings.matchName"
            component={toggleInput}
            type="checkbox"
            label="Name attribute of the input tag"
          />
          <Field
            name="fieldMatchSettings.matchClass"
            component={toggleInput}
            type="checkbox"
            label="Class class attribute of the input tag"
          />
          <br />
          <p>
            Please refer to the <Link to="/custom-fields">custom fields section</Link> to
            learn how input elements are matched.
          </p>
        </div>
      </div>
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
      <h2>Keyboard Shortcuts</h2>
      <div className="form-group">
        <div className="col-sm-offset-3 col-sm-9">
          <button type="submit" className="btn btn-primary">Save Settings</button>
          <button type="button" className="btn btn-link" onClick={onReset}>Reset</button>
          { showSavedMessage && <span className="saved-msg">Saved settings.</span> }
        </div>
      </div>
    </form>
  );
};

GeneralSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  showSavedMessage: PropTypes.bool.isRequired,
};

export default reduxForm({
  form: 'settingsForm',
  enableReinitialize: true,
})(GeneralSettingsForm);

