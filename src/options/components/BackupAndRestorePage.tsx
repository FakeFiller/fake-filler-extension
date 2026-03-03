import * as fileSaver from "file-saver";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetMessage } from "src/common/helpers";
import { getOptions, saveOptions, MyThunkDispatch } from "src/options/actions";
import { IFakeFillerOptions, IAppState } from "src/types";

function utf8ToBase64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  return decodeURIComponent(escape(window.atob(str)));
}

const BackupAndRestorePage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [backupData, setBackupData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVersionMismatch, setIsVersionMismatch] = useState(false);
  const [importedOptions, setImportedOptions] = useState<IFakeFillerOptions>();
  const isFetching = useSelector<IAppState, boolean>((state) => state.optionsData.isFetching);
  const options = useSelector<IAppState, IFakeFillerOptions | null>((state) => state.optionsData.options);
  const dispatch = useDispatch<MyThunkDispatch>();

  useEffect(() => {
    dispatch(getOptions());
  }, [dispatch]);

  const currentOptionsVersion = (options && options.version) || 0;

  function getDateString(date: Date) {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  function exportSettings() {
    const encodedData = utf8ToBase64(JSON.stringify(options));
    const dateStamp = getDateString(new Date());

    try {
      const blob = new Blob([encodedData], { type: "text/plain;charset=utf-8" });
      fileSaver.saveAs(blob, `fake-filler-${dateStamp}.txt`);
    } catch (e) {
      setErrorMessage(GetMessage("backupRestore_errorCreatingBackupFile", (e as Error).toString()));
      setBackupData(encodedData);
    }
  }

  function importSettings() {
    const fileElement = document.getElementById("file") as HTMLInputElement;

    if (fileElement.files && fileElement.files.length === 1 && fileElement.files[0].name.length > 0) {
      // eslint-disable-next-line no-alert
      if (window.confirm(GetMessage("backupRestore_confirmRestore"))) {
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          try {
            const reader = e.target as FileReader;
            const decodedData = base64ToUtf8(reader.result as string);
            const decodedOptions = JSON.parse(decodedData) as IFakeFillerOptions;
            const importedOptionsVersion = decodedOptions.version || 0;

            if (currentOptionsVersion === importedOptionsVersion) {
              dispatch(saveOptions(decodedOptions)).then(() => {
                setShowSuccess(true);
                setErrorMessage("");
              });
            } else {
              setImportedOptions(decodedOptions);
              setIsVersionMismatch(true);
            }
          } catch (ex) {
            setShowSuccess(false);
            setErrorMessage(GetMessage("backupRestore_errorImporting", (ex as Error).toString()));
          }
        };

        fileReader.onerror = () => {
          setShowSuccess(false);
          setErrorMessage(GetMessage("backupRestore_errorReadingFile"));
        };

        fileReader.readAsText(fileElement.files[0]);
      }
    }
  }

  function forceImportOldSettings() {
    // eslint-disable-next-line no-alert
    if (importedOptions && window.confirm(GetMessage("backupRestore_confirmImportOldBackup"))) {
      dispatch(saveOptions(importedOptions)).then(() => {
        setShowSuccess(true);
        setErrorMessage("");
        setIsVersionMismatch(false);
      });
    }
  }

  function triggerImportSettings() {
    const fileElement = document.getElementById("file") as HTMLInputElement;
    fileElement.click();
  }

  function selectTextAreaText() {
    const textAreaElement = document.getElementById("backupTextArea") as HTMLTextAreaElement;
    textAreaElement.select();
  }

  let backupDataElements = null;

  if (backupData) {
    backupDataElements = (
      <div className="form-group">
        <textarea id="backupTextArea" className="form-control" rows={10} onClick={selectTextAreaText} readOnly>
          {backupData}
        </textarea>
        <div className="help-text">{GetMessage("backupRestore_copyAndSaveToFile")}</div>
      </div>
    );
  }

  if (isFetching) {
    return <div>{GetMessage("loading")}</div>;
  }

  return (
    <>
      <h2>{GetMessage("backupRestore_title")}</h2>
      <p>
        <button type="button" className="btn btn-link" onClick={exportSettings}>
          {GetMessage("backupRestore_exportSettings")}
        </button>
      </p>
      <p>
        <button type="button" className="btn btn-link" onClick={triggerImportSettings}>
          {GetMessage("backupRestore_importSettings")}
        </button>
      </p>
      {backupDataElements}
      <input type="file" className="invisible" id="file" onChange={importSettings} />
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      {showSuccess && <p className="alert alert-success">{GetMessage("backupRestore_settingImportSuccessMessage")}</p>}

      {isVersionMismatch && (
        <div className="alert alert-danger">
          <p>{GetMessage("backupRestore_oldBackupErrorMessage")}</p>
          <div>
            <button
              type="button"
              className="btn btn-sm font-weight-bold btn-link p-0 text-danger"
              onClick={forceImportOldSettings}
            >
              {GetMessage("backupRestore_continueAnyway")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BackupAndRestorePage;
