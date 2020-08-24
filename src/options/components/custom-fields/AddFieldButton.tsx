import React from "react";

import { GetMessage } from "src/common/helpers";
import { CustomFieldAddFunction } from "src/types";

type Props = {
  onClick: CustomFieldAddFunction;
  index: number;
  disabled?: boolean;
};

const AddFieldButton = (props: Props) => {
  function handleClick() {
    props.onClick(props.index);
  }

  return (
    <div className="add-field-bar">
      <button type="button" className="btn btn-sm btn-outline-primary" disabled={props.disabled} onClick={handleClick}>
        {GetMessage("customFields_addFieldButtonText")}
      </button>
    </div>
  );
};

AddFieldButton.defaultProps = {
  disabled: false,
};

export default AddFieldButton;
