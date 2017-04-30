import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import NavItem from './NavItem';
import { resetOptions } from '../actions';
import { GetBrowser } from '../../form-filler/helpers';
import language  from '../../form-filler/language'

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
    let rateLink;
    if (GetBrowser() === 'Firefox') {
      rateLink = <a href="https://bit.ly/FormFillerFirefox">{language("appStore")}</a>;
    } else {
        rateLink = <a href="https://bit.ly/FormFillerFirefox">{language("appStore")}</a>;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <h1>
              <img src="images/logo.svg" height="32" alt="Form Filler" />
            </h1>
            <ul className="nav nav-pills nav-stacked">
              <NavItem to="/">{language("general")}</NavItem>
              <NavItem to="/custom-fields">{language("custom")}</NavItem>
              <NavItem to="/keyboard-shortcuts">{language("shortcuts")}</NavItem>
              <NavItem to="/backup">{language("backup")}</NavItem>
            </ul>
            <div id="about">
              <p>
                If you like Form Filler, please {rateLink}. If you have any suggestions to
                make this extension better, or find any issues, please send me
                an <a href="mailto:husainsfabbas@gmail.com">email</a>.
              </p>
              <ul className="list-inline">
                <li><a href="" onClick={this.resetSettings}>{language("restore")}</a></li>
                <li><Link to="/changelog">{language("changelog")}</Link></li>
                <li><a href="https://github.com/husainshabbir/form-filler/">{language("source")}</a></li>
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
/**connect方法将ui组件变为容器组件 将ui组件和前面的组件连接起来*/
export default connect()(App);
