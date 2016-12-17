import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getKeyboardShortcuts } from '../actions';

class KeyboardShortcutsPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentDidMount() {
    this.dispatch(getKeyboardShortcuts());
  }

  render() {
    if (this.props.isFetching) {
      return (<div>Loading...</div>);
    }

    const keyboardShortcuts = this.props.keyboardShortcuts;

    return (
      <div>
        <h2>Keyboard Shortcuts</h2>
        <table className="table table-bordered table-condensed">
          <tbody>
            {
              keyboardShortcuts.map((item, index) => {
                if (item.description) {
                  return (
                    <tr key={index}>
                      <td className="narrow">{item.shortcut ? <kbd>{item.shortcut}</kbd> : 'not set'}</td>
                      <td>{item.description}</td>
                    </tr>
                  );
                }

                return null;
              })
            }
          </tbody>
        </table>
        <p>
          To change these keyboard shortcuts, type <code>chrome://extensions/</code> in the
          address bar to open up the extensions page. At the bottom of that page you will see
          a Keyboard Shortcuts option. Click it, and you can set up custom shortcuts for
          Form Filler from there.
        </p>
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
  isFetching: PropTypes.bool,
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
