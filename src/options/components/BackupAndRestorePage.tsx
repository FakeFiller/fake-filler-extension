import * as fileSaver from 'file-saver';
import * as React from 'react';
import { connect } from 'react-redux';

import { GetBrowser, GetMessage } from '../../common/helpers';
import { DispatchProps, getOptions, saveOptions } from '../actions';

function utf8ToBase64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  return decodeURIComponent(escape(window.atob(str)));
}

interface IState {
  backupData: string;
  errorMessage: string;
  hasError: boolean;
  showSuccess: boolean;
}

interface IOwnProps {}

interface IStateProps {
  options?: IFormFillerOptions;
  isFetching: boolean;
}

interface IProps extends DispatchProps, IOwnProps, IStateProps {}

class BackupAndRestorePage extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

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
    this.selectTextAreaText = this.selectTextAreaText.bind(this);
    this.getDateString = this.getDateString.bind(this);
  }

  private setErrorMessage(message: string): void {
    this.setState({
      showSuccess: false,
      hasError: true,
      errorMessage: message,
    });
  }

  private getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  private exportSettings(): void {
    const encodedData = utf8ToBase64(JSON.stringify(this.props.options));
    const dateStamp = this.getDateString(new Date());
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

  private importSettings(): void {
    const fileElement = document.getElementById('file') as HTMLInputElement;

    if (fileElement.files && fileElement.files.length === 1 && fileElement.files[0].name.length > 0) {
      if (confirm(GetMessage('backupRestore_confirmRestore'))) {
        const fileReader = new FileReader();

        fileReader.onload = e => {
          try {
            const fileReader = e.target as FileReader;
            const decodedData = base64ToUtf8(fileReader.result as string);
            const options = JSON.parse(decodedData);

            this.props.dispatch(saveOptions(options));

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

  private triggerImportSettings(): void {
    const fileElement = document.getElementById('file') as HTMLInputElement;
    fileElement.click();
  }

  private selectTextAreaText(): void {
    const textAreaElement = document.getElementById('backupTextArea') as HTMLTextAreaElement;
    textAreaElement.select();
  }

  public componentDidMount(): void {
    this.props.dispatch(getOptions());
  }

  public render(): JSX.Element {
    if (this.props.isFetching) {
      return <div>{GetMessage('loading')}</div>;
    }

    let backupDataElements = null;

    if (this.state.backupData) {
      backupDataElements = (
        <div className="form-group">
          <textarea id="backupTextArea" className="form-control" rows={10} onClick={this.selectTextAreaText} readOnly>
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
        <input type="file" className="invisible" id="file" onChange={this.importSettings} />
        {this.state.hasError && <p className="alert alert-danger">{this.state.errorMessage}</p>}
        {this.state.showSuccess && (
          <p className="alert alert-success">{GetMessage('backupRestore_settingImportSuccessMessage')}</p>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: IAppState): IStateProps {
  const options = state.optionsData.options;

  if (options) {
    return {
      isFetching: state.optionsData.isFetching,
      options,
    };
  }

  return {
    isFetching: true,
  };
}

export default connect(mapStateToProps)(BackupAndRestorePage) as React.ComponentClass<IOwnProps>;
