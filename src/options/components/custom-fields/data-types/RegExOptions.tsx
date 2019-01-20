import RandExp from 'randexp';
import * as React from 'react';

import { GetHtmlMarkup, GetMessage } from '../../../../common/helpers';
import TextField from '../../common/TextField';

interface IOwnProps {
  regexTemplate?: string;
}

interface IOwnState {
  regexSample?: string;
}

class RegExOptions extends React.PureComponent<IOwnProps, IOwnState> {
  constructor(props: IOwnProps) {
    super(props);

    this.generateRandomRegExString = this.generateRandomRegExString.bind(this);

    this.state = {
      regexSample: undefined,
    };
  }

  private generateRandomRegExString(): void {
    let randomValue: string | undefined;

    if (this.props.regexTemplate) {
      try {
        randomValue = new RandExp(this.props.regexTemplate).gen();
      } catch (e) {
        randomValue = e.toString();
      }
    }

    this.setState({
      regexSample: randomValue,
    });
  }

  public render(): JSX.Element {
    const regexTypeHelpText = (
      <div>
        <p dangerouslySetInnerHTML={GetHtmlMarkup(GetMessage('customFields_regExHelp'))} />
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={this.generateRandomRegExString}>
          {GetMessage('testMe')}
        </button>
      </div>
    );

    return (
      <>
        <TextField name="regexTemplate" label={GetMessage('customFields_label_pattern')} helpText={regexTypeHelpText} />
        {this.state.regexSample && (
          <div className="row">
            <div className="col-sm-3">&nbsp;</div>
            <div className="col-sm-9">{this.state.regexSample}</div>
          </div>
        )}
      </>
    );
  }
}

export default RegExOptions;
