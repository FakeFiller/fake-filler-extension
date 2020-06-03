import * as React from "react";

import { GetMessage } from "src/common/helpers";
import HtmlPhrase from "src/options/components/common/HtmlPhrase";
import TextField from "src/options/components/common/TextField";

class DateOptions extends React.PureComponent {
  public render(): JSX.Element {
    const dateTypeHelpText = <HtmlPhrase phrase={GetMessage("customFields_dateTypeHelp")} />;

    return (
      <>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label text-sm-right" htmlFor="dateMin">
            {GetMessage("customFields_label_minDate")}
          </label>
          <div className="col-sm-9">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">{GetMessage("customFields_label_datePrependText")}</span>
              </div>
              <TextField name="dateMin" type="number" min={-999999} max={999999} />
              <div className="input-group-append">
                <span className="input-group-text">{GetMessage("customFields_label_dateAppendText")}</span>
              </div>
              <TextField name="dateMinDate" type="date" />
            </div>
            <small className="form-text text-muted">{GetMessage("customFields_label_date_helpText")}</small>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label text-sm-right" htmlFor="dateMax">
            {GetMessage("customFields_label_maxDate")}
          </label>
          <div className="col-sm-9">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">{GetMessage("customFields_label_datePrependText")}</span>
              </div>
              <TextField name="dateMax" type="number" min={-999999} max={999999} />
              <div className="input-group-append">
                <span className="input-group-text">{GetMessage("customFields_label_dateAppendText")}</span>
              </div>
              <TextField name="dateMaxDate" type="date" />
            </div>
            <small className="form-text text-muted">{GetMessage("customFields_label_date_helpText")}</small>
          </div>
        </div>
        <TextField name="dateTemplate" label={GetMessage("customFields_label_template")} helpText={dateTypeHelpText} />
      </>
    );
  }
}

export default DateOptions;
