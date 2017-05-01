/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import NavItem from './NavItem';
import { resetOptions } from '../actions';
import { GetBrowser, GetMessage } from '../../form-filler/helpers';

class App extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.resetSettings = this.resetSettings.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getRateThisExtensionMessage() {
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

  // eslint-disable-next-line class-methods-use-this
  getSendFeedbackMessage() {
    return { __html: chrome.i18n.getMessage('leftNav_sendFeedback', ['husainsfabbas@gmail.com']) };
  }

  resetSettings(event) {
    event.preventDefault();
    // eslint-disable-next-line no-alert
    if (window.confirm(GetMessage('leftNav_confirmResetSettings'))) {
      this.dispatch(resetOptions());
      this.dispatch(reset('settingsForm'));
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <h1>
              <img src="images/logo.svg" height="32" alt={GetMessage('extensionName')} />
            </h1>
            <ul className="nav nav-pills nav-stacked">
              <NavItem to="/">{GetMessage('leftNav_General')}</NavItem>
              <NavItem to="/custom-fields">{GetMessage('leftNav_customFields')}</NavItem>
              <NavItem to="/keyboard-shortcuts">{GetMessage('leftNav_keyboardShortcuts')}</NavItem>
              <NavItem to="/backup">{GetMessage('leftNav_backupRestore')}</NavItem>
            </ul>
            <div id="about">
              <p>
                <span dangerouslySetInnerHTML={this.getRateThisExtensionMessage()} />
                {' '}
                <span dangerouslySetInnerHTML={this.getSendFeedbackMessage()} />
              </p>
              <ul className="list-inline">
                <li>
                  <a href="" onClick={this.resetSettings}>{GetMessage('leftNav_restoreFactorySettings')}</a>
                </li>
                <li>
                  <Link to="/changelog">{GetMessage('leftNav_changelog')}</Link>
                </li>
                <li>
                  <a href="https://github.com/husainshabbir/form-filler/" target="_blank" rel="noopener noreferrer">
                    {GetMessage('leftNav_source')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-sm-9">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

export default connect()(App);
