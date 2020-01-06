import * as React from 'react';
import { connect } from 'react-redux';

import { GetBrowser, GetMessage } from 'src/common/helpers';
import { DispatchProps, getKeyboardShortcuts } from 'src/options/actions';
import ChromeKeyboardShortcuts from 'src/options/components/keyboard-shortcuts/ChromeKeyboardShortcuts';
import FirefoxKeyboardShortcuts from 'src/options/components/keyboard-shortcuts/FirefoxKeyboardShortcuts';

interface IOwnProps {}

interface IStateProps {
  isFetching: boolean;
  keyboardShortcuts: chrome.commands.Command[];
}

interface IProps extends DispatchProps, IOwnProps, IStateProps {}

class KeyboardShortcutsPage extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);

    this.getHtmlMessage = this.getHtmlMessage.bind(this);
    this.getTranslatedDescription = this.getTranslatedDescription.bind(this);
  }

  private getHtmlMessage(key: string): { __html: string } {
    return { __html: chrome.i18n.getMessage(key) };
  }

  private getTranslatedDescription(key: string): string {
    if (key.startsWith('__MSG_')) {
      return GetMessage(key.replace('__MSG_', '').replace('__', ''));
    }
    return key;
  }

  public componentDidMount(): void {
    this.props.dispatch(getKeyboardShortcuts());
  }

  public render(): JSX.Element {
    if (this.props.isFetching) {
      return <div>{GetMessage('loading')}</div>;
    }

    const shortcuts = this.props.keyboardShortcuts;
    const isFirefox = GetBrowser() === 'Firefox';

    return isFirefox ? (
      <FirefoxKeyboardShortcuts keyboardShortcuts={shortcuts} />
    ) : (
      <ChromeKeyboardShortcuts keyboardShortcuts={shortcuts} />
    );
  }
}

function mapStateToProps(state: IAppState): IStateProps {
  const keyboardShortcuts = state.keyboardShortcutsData.shortcuts;

  if (keyboardShortcuts) {
    return {
      isFetching: state.keyboardShortcutsData.isFetching,
      keyboardShortcuts,
    };
  }

  return {
    isFetching: true,
    keyboardShortcuts: [],
  };
}

export default connect(mapStateToProps)(KeyboardShortcutsPage);
