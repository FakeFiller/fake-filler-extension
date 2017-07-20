/* eslint-disable react/no-array-index-key */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getKeyboardShortcuts } from '../actions';
import { GetBrowser, GetMessage } from '../../form-filler/helpers';

class KeyboardShortcutsPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentDidMount() {
    this.dispatch(getKeyboardShortcuts());
  }

  // eslint-disable-next-line class-methods-use-this
  getHtmlMessage(key) {
    return { __html: chrome.i18n.getMessage(key) };
  }

  // eslint-disable-next-line class-methods-use-this
  getTranslatedDescription(key) {
    if (key.startsWith('__MSG_')) {
      return GetMessage(key.replace('__MSG_', '').replace('__', ''));
    }
    return key;
  }

  render() {
    if (this.props.isFetching) {
      return (<div>{GetMessage('loading')}</div>);
    }

    const keyboardShortcuts = this.props.keyboardShortcuts;
    const isFirefox = GetBrowser() === 'Firefox';

    const notSetText = GetMessage('kbdShortcuts_notSet');

    return (
      <div>
        <h2>{GetMessage('kbdShortcuts_title')}</h2>
        <table className="table table-bordered table-condensed">
          <tbody>
            {
              keyboardShortcuts.map((item, index) => {
                if (item.description) {
                  return (
                    <tr key={index}>
                      <td className="narrow">{item.shortcut ? <kbd>{item.shortcut}</kbd> : notSetText}</td>
                      <td>{this.getTranslatedDescription(item.description)}</td>
                    </tr>
                  );
                }

                return null;
              })
            }
          </tbody>
        </table>
        { isFirefox && <p dangerouslySetInnerHTML={this.getHtmlMessage('kbdShortcuts_firefoxComingSoon')} /> }
        { !isFirefox && <p dangerouslySetInnerHTML={this.getHtmlMessage('kbdShortcuts_changeInstructions')} /> }
      </div>
    );
  }
}

KeyboardShortcutsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  keyboardShortcuts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    shortcut: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })),
  isFetching: PropTypes.bool.isRequired,
};

KeyboardShortcutsPage.defaultProps = {
  keyboardShortcuts: null,
};

function mapStateToProps(state) {
  const keyboardShortcuts = state.KeyboardShortcutsReducer.shortcuts;

  if (keyboardShortcuts) {
    return {
      isFetching: state.KeyboardShortcutsReducer.isFetching,
      keyboardShortcuts,
    };
  }

  return {
    isFetching: true,
    keyboardShortcuts: null,
  };
}

export default connect(mapStateToProps)(KeyboardShortcutsPage);
