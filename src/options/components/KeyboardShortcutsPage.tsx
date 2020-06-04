import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetMessage } from "src/common/helpers";
import { getKeyboardShortcuts, MyThunkDispatch } from "src/options/actions";
import HtmlPhrase from "src/options/components/common/HtmlPhrase";
import { IAppState } from "src/types";

const KeyboardShortcutsPage = () => {
  const isFetching = useSelector<IAppState, boolean>((state) => state.keyboardShortcutsData.isFetching);
  const keyboardShortcuts = useSelector<IAppState, chrome.commands.Command[]>(
    (state) => state.keyboardShortcutsData.shortcuts
  );
  const dispatch = useDispatch<MyThunkDispatch>();

  useEffect(() => {
    dispatch(getKeyboardShortcuts());
  }, [dispatch]);

  function getTranslatedDescription(key: string) {
    if (key.startsWith("__MSG_")) {
      return GetMessage(key.replace("__MSG_", "").replace("__", ""));
    }
    return key;
  }

  const notSetText = <small>{GetMessage("kbdShortcuts_notSet")}</small>;

  if (isFetching) {
    return <div>{GetMessage("loading")}</div>;
  }

  return (
    <>
      <h2>{GetMessage("kbdShortcuts_title")}</h2>
      <table className="table table-bordered table-sm">
        <tbody>
          {keyboardShortcuts.map((item) => {
            if (item.description) {
              return (
                <tr key={item.name}>
                  <td className="narrow text-center">{item.shortcut ? <kbd>{item.shortcut}</kbd> : notSetText}</td>
                  <td>{getTranslatedDescription(item.description)}</td>
                </tr>
              );
            }

            return null;
          })}
        </tbody>
      </table>
      <HtmlPhrase phrase={GetMessage("kbdShortcuts_changeInstructions")} as="p" />
    </>
  );
};

export default KeyboardShortcutsPage;
