import * as React from "react";

import { GetMessage } from "src/common/helpers";
import TextField from "src/options/components/common/TextField";

class AlphanumericOptions extends React.PureComponent {
  public render(): JSX.Element {
    const alphanumericTypeHelpText = (
      <div>
        <div className="row">
          <div className="col-sm-6">
            <code>L</code> {GetMessage("customFields_alNumHelp_uppercaseLetter")}
            <br />
            <code>l</code> {GetMessage("customFields_alNumHelp_lowercaseLetter")}
            <br />
            <code>D</code> {GetMessage("customFields_alNumHelp_upperAndLowercaseLetter")}
            <br />
            <code>C</code> {GetMessage("customFields_alNumHelp_uppercaseConsonant")}
            <br />
            <code>c</code> {GetMessage("customFields_alNumHelp_lowercaseConsonant")}
            <br />
            <code>E</code> {GetMessage("customFields_alNumHelp_upperAndLowercaseConsonant")}
          </div>
          <div className="col-sm-6">
            <code>V</code> {GetMessage("customFields_alNumHelp_uppercaseVowel")}
            <br />
            <code>v</code> {GetMessage("customFields_alNumHelp_lowercaseVowel")}
            <br />
            <code>F</code> {GetMessage("customFields_alNumHelp_upperAndLowercaseVowel")}
            <br />
            <code>x</code> {GetMessage("customFields_alNumHelp_number09")}
            <br />
            <code>X</code> {GetMessage("customFields_alNumHelp_number19")}
          </div>
        </div>
        <br />
        <p>{GetMessage("customFields_alNumHelp_otherCharactersAsIs")}</p>
      </div>
    );

    return (
      <TextField
        name="alphanumericTemplate"
        label={GetMessage("customFields_label_format")}
        helpText={alphanumericTypeHelpText}
      />
    );
  }
}

export default AlphanumericOptions;
