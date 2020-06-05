import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { GetMessage } from "src/common/helpers";
import { saveOptions, MyThunkDispatch, getOptions } from "src/options/actions";
import GeneralSettingsForm from "src/options/components/general-settings/GeneralSettingsForm";
import { IFakeFillerOptions, IFakeFillerOptionsForm, IAppState } from "src/types";

const GeneralSettingsPage = () => {
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const isFetching = useSelector<IAppState, boolean>((state) => state.optionsData.isFetching);
  const options = useSelector<IAppState, IFakeFillerOptions | null>((state) => state.optionsData.options);
  const dispatch = useDispatch<MyThunkDispatch>();

  useEffect(() => {
    dispatch(getOptions());
  }, [dispatch]);

  function handleSave(formValues: IFakeFillerOptionsForm) {
    if (options) {
      dispatch(saveOptions(options, formValues)).then(() => {
        setShowSavedMessage(true);
      });
    }
  }

  if (isFetching || options === null) {
    return <div>{GetMessage("loading")}</div>;
  }

  return <GeneralSettingsForm options={options} showSavedMessage={showSavedMessage} onSave={handleSave} />;
};

export default GeneralSettingsPage;
