import * as React from "react";

import { GetMessage } from "src/common/helpers";
import TextAreaField from "src/options/components/common/TextAreaField";

class RandomizedListOptions extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <TextAreaField
        name="list"
        label={GetMessage("customFields_label_listItems")}
        helpText={GetMessage("customFields_label_listItems_placeholder")}
      />
    );
  }
}

export default RandomizedListOptions;
