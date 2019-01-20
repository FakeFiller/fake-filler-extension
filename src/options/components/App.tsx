import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Route, RouteComponentProps } from 'react-router-dom';

import { GetBrowser, GetMessage } from '../../common/helpers';
import { DispatchProps, resetOptions } from '../actions';

import BackupAndRestorePage from './BackupAndRestorePage';
import ChangeLogPage from './ChangeLogPage';
import CustomFieldsPage from './CustomFieldsPage';
import GeneralSettingsPage from './GeneralSettingsPage';
import KeyboardShortcutsPage from './KeyboardShortcutsPage';

import './App.scss';
import ExternalLink from './common/ExternalLink';

interface IOwnProps extends RouteComponentProps<{}> {}

interface IProps extends DispatchProps, IOwnProps {}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.getRateThisExtensionMessage = this.getRateThisExtensionMessage.bind(this);
    this.getSendFeedbackMessage = this.getSendFeedbackMessage.bind(this);
    this.getActiveClass = this.getActiveClass.bind(this);
    this.resetSettings = this.resetSettings.bind(this);
  }

  private getRateThisExtensionMessage(): { __html: string } {
    let rateKey;
    let rateLink;

    if (GetBrowser() === 'Firefox') {
      rateLink = 'https://bit.ly/FormFillerFirefox';
      rateKey = 'leftNav_rate_AMO';
    } else {
      rateLink = 'https://bit.ly/FormFiller';
      rateKey = 'leftNav_rate_Chrome';
    }

    return { __html: GetMessage(rateKey, [rateLink]) };
  }

  private getSendFeedbackMessage(): { __html: string } {
    return { __html: chrome.i18n.getMessage('leftNav_sendFeedback', ['husainsfabbas@gmail.com']) };
  }

  private getActiveClass(match: string, exact: boolean = true): string {
    if (exact) {
      if (this.props.location.pathname === match) {
        return 'nav-link active';
      }
    } else if (this.props.location.pathname.startsWith(match)) {
      return 'nav-link active';
    }

    return 'nav-link';
  }

  private resetSettings(event: React.SyntheticEvent): void {
    event.preventDefault();

    if (window.confirm(GetMessage('leftNav_confirmResetSettings'))) {
      this.props.dispatch(resetOptions());
    }
  }

  public render(): JSX.Element {
    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div id="main-bar">
              <h1>
                <img src="images/logo.svg" height="32" alt={GetMessage('extensionName')} />
              </h1>
              <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                  <Link to="/" className={this.getActiveClass('/', true)}>
                    {GetMessage('leftNav_General')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/custom-fields" className={this.getActiveClass('/custom-fields')}>
                    {GetMessage('leftNav_customFields')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/keyboard-shortcuts" className={this.getActiveClass('/keyboard-shortcuts')}>
                    {GetMessage('leftNav_keyboardShortcuts')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/backup" className={this.getActiveClass('/backup')}>
                    {GetMessage('leftNav_backupRestore')}
                  </Link>
                </li>
              </ul>
              <div id="about">
                <p>
                  <span dangerouslySetInnerHTML={this.getRateThisExtensionMessage()} />{' '}
                  <span dangerouslySetInnerHTML={this.getSendFeedbackMessage()} />
                </p>
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <a href="#" onClick={this.resetSettings}>
                      {GetMessage('leftNav_restoreFactorySettings')}
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <Link to="/changelog">
                      {GetMessage('leftNav_changelog')}
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <ExternalLink url="https://github.com/husainshabbir/form-filler/">
                      {GetMessage('leftNav_source')}
                    </ExternalLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-9">
            <Route path="/" exact component={GeneralSettingsPage} />
            <Route path="/custom-fields" component={CustomFieldsPage} />
            <Route path="/keyboard-shortcuts" component={KeyboardShortcutsPage} />
            <Route path="/backup" component={BackupAndRestorePage} />
            <Route path="/changelog" component={ChangeLogPage} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(App) as React.ComponentClass<IOwnProps>;
