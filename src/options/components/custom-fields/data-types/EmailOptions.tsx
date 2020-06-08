import React from "react";

import ElementFiller from "src/common/element-filler";
import { GetMessage, FakeFillerDefaultOptions, DEFAULT_EMAIL_CUSTOM_FIELD, CsvToArray } from "src/common/helpers";
import RadioButtonField from "src/options/components/common/RadioButtonField";
import TextField from "src/options/components/common/TextField";
import { ICustomFieldForm } from "src/types";

type Props = ICustomFieldForm;

const options = FakeFillerDefaultOptions();
options.fields = [];
options.fields.push(DEFAULT_EMAIL_CUSTOM_FIELD);
options.fields.push({
  type: "username",
  name: "Username",
  match: ["user"],
});
options.fields.push({
  type: "full-name",
  name: "Full Name",
  match: ["name"],
});

const EmailOptions = (props: Props) => {
  const { emailHostname, emailHostnameList, emailUsername, emailUsernameList, emailUsernameRegEx } = props;

  function generateRandomEmail() {
    options.fields[0].emailHostname = emailHostname;
    options.fields[0].emailHostnameList = CsvToArray(emailHostnameList);
    options.fields[0].emailUsername = emailUsername;
    options.fields[0].emailUsernameList = CsvToArray(emailUsernameList);
    options.fields[0].emailUsernameRegEx = emailUsernameRegEx;

    const elementFiller = new ElementFiller(options);
    const element = document.getElementById("email") as HTMLInputElement;

    if (options.fields[0].emailUsername === "username") {
      element.setAttribute("id", "user");
      element.setAttribute("type", "text");
      element.setAttribute("name", "user");
      elementFiller.fillInputElement(element);
      element.value = "";
    }

    if (options.fields[0].emailUsername === "name") {
      element.setAttribute("id", "name");
      element.setAttribute("type", "text");
      element.setAttribute("name", "name");
      elementFiller.fillInputElement(element);
      element.value = "";
    }

    element.setAttribute("id", "email");
    element.setAttribute("type", "email");
    element.setAttribute("name", "email");
    elementFiller.fillInputElement(element);
  }

  return (
    <div>
      <div className="form-group row">
        <label className="col-sm-3 col-form-label text-sm-right pt-0" htmlFor="emailUsername">
          {GetMessage("customFields_label_username")}
        </label>
        <div className="col-sm-9">
          <RadioButtonField
            name="emailUsername"
            value="username"
            label={GetMessage("customFields_label_username_usernameLabel")}
          />
          <RadioButtonField
            name="emailUsername"
            value="name"
            label={GetMessage("customFields_label_username_nameLabel")}
          />
          <RadioButtonField
            name="emailUsername"
            value="random"
            label={GetMessage("customFields_label_username_randomLabel")}
          />
          <RadioButtonField
            name="emailUsername"
            value="list"
            label={GetMessage("customFields_label_username_listLabel")}
          />
          <TextField name="emailUsernameList" placeholder={GetMessage("enterCsv")} />
          <RadioButtonField
            name="emailUsername"
            value="regex"
            label={GetMessage("customFields_label_username_regExTextPlaceholder")}
          />
          <TextField name="emailUsernameRegEx" placeholder={GetMessage("enterCsv")} />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-3 col-form-label text-sm-right pt-0" htmlFor="emailHostname">
          {GetMessage("customFields_label_hostName")}
        </label>
        <div className="col-sm-9">
          <RadioButtonField
            name="emailHostname"
            value="random"
            label={GetMessage("customFields_label_hostName_randomLabel")}
          />
          <RadioButtonField
            name="emailHostname"
            value="list"
            label={GetMessage("customFields_label_hostName_listLabel")}
          />
          <TextField
            name="emailHostnameList"
            placeholder={GetMessage("enterCsv")}
            helpText={GetMessage("customFields_label_hostName_listTextHelp")}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">&nbsp;</div>
        <div className="col-sm-9">
          <div className="row no-gutters align-items-center">
            <div className="col-auto">
              <button type="button" className="btn btn-sm btn-outline-primary mr-2" onClick={generateRandomEmail}>
                {GetMessage("testMe")}
              </button>
            </div>
            <div className="col">
              <input
                id="email"
                type="email"
                name="email"
                className="form-control form-control-sm"
                tabIndex={-1}
                readOnly
                style={{ backgroundColor: "white", border: "none", cursor: "default", outline: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOptions;
