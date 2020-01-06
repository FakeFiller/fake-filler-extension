import * as React from 'react';

import { GetHtmlMarkup, GetMessage } from 'src/common/helpers';
import TextField from 'src/options/components/common/TextField';

class DateOptions extends React.PureComponent {
  public render(): JSX.Element {
    const dateTypeHelpText = <span dangerouslySetInnerHTML={GetHtmlMarkup(GetMessage('customFields_dateTypeHelp'))} />;

    return (
      <TextField name="dateTemplate" label={GetMessage('customFields_label_template')} helpText={dateTypeHelpText} />
    );
  }
}

export default DateOptions;
