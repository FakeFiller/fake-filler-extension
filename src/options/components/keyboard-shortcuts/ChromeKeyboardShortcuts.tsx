import * as React from 'react';

import { GetHtmlMarkup, GetMessage } from '../../../common/helpers';

interface IOwnProps {
  keyboardShortcuts: chrome.commands.Command[];
}

class ChromeKeyboardShortcuts extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.getTranslatedDescription = this.getTranslatedDescription.bind(this);
  }

  private getTranslatedDescription(key: string): string {
    if (key.startsWith('__MSG_')) {
      return GetMessage(key.replace('__MSG_', '').replace('__', ''));
    }
    return key;
  }

  public render(): JSX.Element {
    const notSetText = GetMessage('kbdShortcuts_notSet');

    return (
      <>
        <h2>{GetMessage('kbdShortcuts_title')}</h2>
        <table className="table table-borderless table-sm">
          <tbody>
            {this.props.keyboardShortcuts.map((item, index) => {
              if (item.description) {
                return (
                  <tr key={index}>
                    <td className="narrow">{item.shortcut ? <kbd>{item.shortcut}</kbd> : notSetText}</td>
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

export default ChromeKeyboardShortcuts;
