import * as React from 'react';

import { GetMessage } from '../../../../common/helpers';
import TextField from '../../common/TextField';

class NumberOptions extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <>
        <TextField name="numberMin" type="number" label={GetMessage('customFields_label_minValue')} />
        <TextField name="numberMax" type="number" label={GetMessage('customFields_label_maxValue')} />
        <TextField name="numberPlaces" type="number" label={GetMessage('customFields_label_decimalPlaces')} />
      </>
    );
  }
}

export default NumberOptions;
