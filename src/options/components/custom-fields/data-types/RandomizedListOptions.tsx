import * as React from 'react';

import { GetMessage } from '../../../../common/helpers';
import TextAreaField from '../../common/TextAreaField';

class RandomizedListOptions extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <TextAreaField
        name="list"
        label={GetMessage('customFields_label_listItems')}
        helpText={GetMessage('customFields_label_listItems_placeholder')}
      />
    );
  }
}

export default RandomizedListOptions;
