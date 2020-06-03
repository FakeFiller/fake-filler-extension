import * as React from "react";

import { GetMessage } from "src/common/helpers";
import { CustomFieldAddFunction } from "src/types";

interface IOwnProps {
  onClick: CustomFieldAddFunction;
  index: number;
  disabled?: boolean;
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
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={this.props.disabled}
          onClick={this.handleClick}
        >
          {GetMessage("customFields_addFieldButtonText")}
        </button>
      </div>
    );
  }
}

export default AddFieldButton;
