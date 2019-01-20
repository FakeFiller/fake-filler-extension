import * as React from 'react';

import { GetMessage } from '../../../common/helpers';
import ExternalLink from '../common/ExternalLink';

class Introduction extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <div>
        <p>{GetMessage('customFields_intro')}</p>
        <p>
          <ExternalLink url="https://github.com/husainshabbir/form-filler/wiki/Custom-Fields-Matching">
            <b>{GetMessage('customFields_getMoreInfo')}</b>
          </ExternalLink>
        </p>
      </div>
    );
  }
}

export default Introduction;
