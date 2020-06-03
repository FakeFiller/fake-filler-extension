import * as React from "react";

import { GetMessage } from "src/common/helpers";
import TextField from "src/options/components/common/TextField";

class TelephoneOptions extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <TextField
        name="telephoneTemplate"
        label={GetMessage("customFields_label_template")}
        helpText={GetMessage("customFields_label_telephoneTemplate_helpText")}
      />
    );
  }
}

export default TelephoneOptions;
