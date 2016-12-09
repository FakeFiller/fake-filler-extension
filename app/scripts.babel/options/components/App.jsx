import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import NavItem from './NavItem';
import { resetOptions } from '../actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.resetSettings = this.resetSettings.bind(this);
  }

  resetSettings(event) {
    event.preventDefault();
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to reset to the default settings?')) {
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
              <img src="images/icon-48.png" width="32" height="32" role="presentation" />
              Form Filler
            </h1>
            <ul className="nav nav-pills nav-stacked">
              <NavItem to="/">General</NavItem>
              <NavItem to="/custom-fields">Custom Fields</NavItem>
              <NavItem to="/backup">Backup and Restore</NavItem>
            </ul>
            <div id="about">
              <p>
                If you like Form Filler, please <a href="">rate it on the Chrome Web Store.</a> If
                you have any suggestions to make this extension better, or find any issues, please
                send me an <a href="mailto:husainsfabbas@gmail.com">email</a>.
              </p>
              <ul className="list-inline">
                <li><a href="" onClick={this.resetSettings}>Restore Factory Settings</a></li>
                <li><Link to="/changelog">Changelog</Link></li>
                <li><a href="https://github.com/husainshabbir/form-filler/">Source</a></li>
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
