import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import fileSaver from 'file-saver';

import { getOptions, saveOptions } from '../actions';
import { shapeOfOptions } from '../prop-types';
import { GetBrowser, GetMessage } from '../../form-filler/helpers';

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
      backupData: '',
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
    const isFirefox = GetBrowser() === 'Firefox';

    if (isFirefox) {
      this.setState({
        backupData: encodedData,
      });
    } else {
      try {
        const blob = new Blob([encodedData], { type: 'text/plain;charset=utf-8' });
        fileSaver.saveAs(blob, `form-filler-${dateStamp}.txt`);
      } catch (e) {
        this.setErrorMessage(GetMessage('backupRestore_errorCreatingBackupFile', e.toString()));
      }
    }
  }

  importSettings() {
    const fileElement = document.getElementById('file');

    if (fileElement.files.length === 1 && fileElement.files[0].name.length > 0) {
      // eslint-disable-next-line no-alert
      if (confirm(GetMessage('backupRestore_confirmRestore'))) {
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
            this.setErrorMessage(GetMessage('backupRestore_errorImporting', ex.toString()));
          }
        };

        fileReader.onerror = () => {
          this.setErrorMessage(GetMessage('backupRestore_errorReadingFile'));
        };

        fileReader.readAsText(fileElement.files[0]);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  triggerImportSettings() {
    document.getElementById('file').click();
  }

  // eslint-disable-next-line class-methods-use-this
  selectTextAreaText() {
    document.getElementById('backupTextArea').select();
  }

  render() {
    if (this.props.isFetching) {
      return (<div>{GetMessage('loading')}</div>);
    }

    let backupDataElements = null;

    if (this.state.backupData) {
      backupDataElements = (
        <div className="form-group">
          <textarea
            id="backupTextArea"
            className="form-control"
            rows="10"
            onClick={this.selectTextAreaText}
            readOnly
          >
            {this.state.backupData}
          </textarea>
          <div className="help-text">{GetMessage('backupRestore_copyAndSaveToFile')}</div>
        </div>
      );
    }

    return (
      <div>
        <h2>{GetMessage('backupRestore_title')}</h2>
        <p>
          <button type="button" className="btn btn-link" onClick={this.exportSettings}>
            {GetMessage('backupRestore_exportSettings')}
          </button>
        </p>
        <p>
          <button type="button" className="btn btn-link" onClick={this.triggerImportSettings}>
            {GetMessage('backupRestore_importSettings')}
          </button>
        </p>
        {backupDataElements}
        <input type="file" className="hide" id="file" onChange={this.importSettings} />
        { this.state.hasError && <p className="alert alert-danger">{this.state.errorMessage}</p> }
        {
          this.state.showSuccess &&
          <p className="alert alert-success">{GetMessage('backupRestore_settingImportSuccessMessage')}</p>
        }
      </div>
    );
  }
}

BackupAndRestorePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  options: shapeOfOptions,
  isFetching: PropTypes.bool.isRequired,
};

BackupAndRestorePage.defaultProps = {
  options: null,
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
