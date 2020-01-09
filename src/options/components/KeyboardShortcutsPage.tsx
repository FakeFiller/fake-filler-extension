import * as React from 'react';
import { connect } from 'react-redux';

import { GetHtmlMarkup, GetMessage } from 'src/common/helpers';
import { DispatchProps, getKeyboardShortcuts } from 'src/options/actions';

interface IOwnProps {}

interface IStateProps {
  isFetching: boolean;
  keyboardShortcuts: chrome.commands.Command[];
}

interface IProps extends DispatchProps, IOwnProps, IStateProps {}

class KeyboardShortcutsPage extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);

    this.getTranslatedDescription = this.getTranslatedDescription.bind(this);
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

    const notSetText = <small>{GetMessage('kbdShortcuts_notSet')}</small>;

    return (
      <>
        <h2>{GetMessage('kbdShortcuts_title')}</h2>
        <table className="table table-bordered table-sm">
          <tbody>
            {this.props.keyboardShortcuts.map((item, index) => {
              if (item.description) {
                return (
                  <tr key={index}>
                    <td className="narrow text-center">{item.shortcut ? <kbd>{item.shortcut}</kbd> : notSetText}</td>
                    <td>{this.getTranslatedDescription(item.description)}</td>
                  </tr>
                );
              }

              return null;
            })}
          </tbody>
        </table>
        <p dangerouslySetInnerHTML={GetHtmlMarkup(GetMessage('kbdShortcuts_changeInstructions'))} />
      </>
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
