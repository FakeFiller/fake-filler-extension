import * as React from 'react';

import { GetMessage } from '../../../common/helpers';

interface IOwnProps {
  onClick: CustomFieldAddFunction;
  index: number;
}

class AddFieldButton extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(): void {
    this.props.onClick(this.props.index);
  }

  public render(): JSX.Element {
    return (
      <div className="add-field-bar">
        <button className="add-field-bar-button" onClick={this.handleClick}>
          {GetMessage('customFields_addFieldButtonText')}
        </button>
      </div>
    );
  }
}

export default AddFieldButton;
