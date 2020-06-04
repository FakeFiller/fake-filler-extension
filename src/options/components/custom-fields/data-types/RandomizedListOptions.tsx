import React from "react";

import { GetMessage } from "src/common/helpers";
import TextAreaField from "src/options/components/common/TextAreaField";

const RandomizedListOptions = () => {
  return (
    <TextAreaField
      name="list"
      label={GetMessage("customFields_label_listItems")}
      helpText={GetMessage("customFields_label_listItems_placeholder")}
    />
  );
};

export default RandomizedListOptions;
