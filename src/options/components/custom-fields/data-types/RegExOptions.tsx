import RandExp from "randexp";
import React, { useState } from "react";

import { GetMessage } from "src/common/helpers";
import HtmlPhrase from "src/options/components/common/HtmlPhrase";
import TextField from "src/options/components/common/TextField";

interface IOwnProps {
  regexTemplate?: string;
}

const RegExOptions = (props: IOwnProps) => {
  const [regExSample, setRegExSample] = useState("");

  function generateRandomRegExString() {
    let randomValue = "";

    if (props.regexTemplate) {
      try {
        const regExGenerator = new RandExp(props.regexTemplate);
        regExGenerator.defaultRange.add(0, 65535);
        randomValue = regExGenerator.gen();
      } catch (e) {
        randomValue = e.toString();
      }
    }

    setRegExSample(randomValue);
  }

  const regexTypeHelpText = (
    <div>
      <HtmlPhrase phrase={GetMessage("customFields_regExHelp")} as="p" />
      <button type="button" className="btn btn-sm btn-outline-primary" onClick={generateRandomRegExString}>
        {GetMessage("testMe")}
      </button>
    </div>
  );

  return (
    <>
      <TextField name="regexTemplate" label={GetMessage("customFields_label_pattern")} helpText={regexTypeHelpText} />
      {regExSample && (
        <div className="row">
          <div className="col-sm-3">&nbsp;</div>
          <div className="col-sm-9">{regExSample}</div>
        </div>
      )}
    </>
  );
};

export default RegExOptions;
