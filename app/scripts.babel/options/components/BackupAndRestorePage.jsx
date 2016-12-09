import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import fileSaver from 'file-saver';

import { getOptions, saveOptions } from '../actions';
import { shapeOfOptions } from '../prop-types';

function utf8ToBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

class BackupAndRestorePage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;

    this.state = {
      showSuccess: false,
      hasError: false,
      errorMessage: '',
    };

    this.exportSettings = this.exportSettings.bind(this);
    this.importSettings = this.importSettings.bind(this);
    this.triggerImportSettings = this.triggerImportSettings.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
  }

  componentDidMount() {
    this.dispatch(getOptions());
  }

  setErrorMessage(message) {
    this.setState({
      showSuccess: false,
      hasError: true,
      errorMessage: message,
    });
  }

  exportSettings() {
    const encodedData = utf8ToBase64(JSON.stringify(this.props.options));
    const dateStamp = moment().format('YYYY-MM-DD');

    try {
      const blob = new Blob([encodedData], { type: 'text/plain;charset=utf-8' });
      fileSaver.saveAs(blob, `form-filler-${dateStamp}.txt`);
    } catch (e) {
      this.setErrorMessage(`Error creating a backup file: ${e.toString()}`);
    }
  }

  importSettings() {
    const fileElement = document.getElementById('file');

    if (fileElement.files.length === 1 && fileElement.files[0].name.length > 0) {
      // eslint-disable-next-line no-alert
      if (confirm('Are you sure you want to restore the settings?\n\nNote: Existing settings will be replaced.')) {
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          try {
            const decodedData = base64ToUtf8(e.target.result);
            const options = JSON.parse(decodedData);

            this.dispatch(saveOptions(options));

            this.setState({
              showSuccess: true,
              hasError: false,
              errorMessage: '',
            });
          } catch (ex) {
            this.setErrorMessage(`Error importing from file: ${ex.toString()}`);
          }
        };

        fileReader.onerror = () => {
          this.setErrorMessage('Error reading backup file.');
        };

        fileReader.readAsText(fileElement.files[0]);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  triggerImportSettings() {
    document.getElementById('file').click();
  }

  render() {
    if (this.props.isFetching) {
      return (<div>Loading...</div>);
    }

    return (
      <div>
        <h2>Backup and Restore</h2>
        <p>
          <button type="button" className="btn btn-link" onClick={this.exportSettings}>
            Export Settings
          </button>
        </p>
        <p>
          <button type="button" className="btn btn-link" onClick={this.triggerImportSettings}>
            Import Settings
          </button>
        </p>
        <input type="file" className="hide" id="file" onChange={this.importSettings} />
        { this.state.hasError && <p className="alert alert-danger">{this.state.errorMessage}</p> }
        { this.state.showSuccess &&
          (
            <p className="alert alert-success">
              Settings imported successfully! You will need to reload all your tabs for the
              settings to take effect.
            </p>
          )
        }
      </div>
    );
  }
}

BackupAndRestorePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  options: shapeOfOptions,
  isFetching: PropTypes.bool,
};

function mapStateToProps(state) {
  const options = state.OptionsReducer.options;

  if (options) {
    return {
      isFetching: state.OptionsReducer.isFetching,
      options,
    };
  }

  return {
    isFetching: true,
    options: null,
  };
}

export default connect(mapStateToProps)(BackupAndRestorePage);
