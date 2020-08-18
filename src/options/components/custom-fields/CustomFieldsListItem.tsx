import React from "react";
import { Draggable } from "react-beautiful-dnd";

import { GetMessage } from "src/common/helpers";
import AddFieldButton from "src/options/components/custom-fields/AddFieldButton";
import { ICustomField, CustomFieldAddFunction, CustomFieldEditFunction, CustomFieldDeleteFunction } from "src/types";

function isNotEmpty(item: string | number | undefined | null): boolean {
  return item !== undefined && item !== null && !Number.isNaN(parseInt(String(item), 10));
}

function isNotZero(item: string | number | undefined | null): boolean {
  if (isNotEmpty(item)) {
    const value = parseFloat(String(item));
    return value !== 0;
  }
  return false;
}

type Props = {
  customField: ICustomField;
  itemIndex: number;
  allowAdd: boolean;
  allowEdit: boolean;
  onAdd: CustomFieldAddFunction;
  onEdit: CustomFieldEditFunction;
  onDelete: CustomFieldDeleteFunction;
};

const CustomFieldsListItem = (props: Props) => {
  const { customField } = props;

  function handleEdit() {
    props.onEdit(props.customField, props.itemIndex);
  }

  function handleDelete() {
    props.onDelete(props.itemIndex);
  }

  return (
    <Draggable draggableId={`draggable-${props.itemIndex}`} index={props.itemIndex}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className="card custom-field">
            <div className="card-header">
              <strong>{customField.name}</strong>
              <div className={`custom-field-buttons ${props.allowEdit ? "" : "invisible"}`}>
                <div className="btn btn-sm btn-link drag-handle" {...provided.dragHandleProps}>
                  <img src="images/move.svg" width="12" height="12" alt={GetMessage("move")} />
                </div>
                <button type="button" className="btn btn-sm btn-link" onClick={handleEdit} disabled={!props.allowEdit}>
                  <img src="images/edit.svg" width="12" height="12" alt={GetMessage("edit")} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-link"
                  onClick={handleDelete}
                  disabled={!props.allowEdit}
                >
                  <img src="images/delete.svg" width="12" height="12" alt={GetMessage("delete")} />
                </button>
              </div>
            </div>
            <table className="table">
              <tbody>
                <tr>
                  <td className="col-3">{GetMessage("customFields_label_dataType")}</td>
                  <td>{customField.type}</td>
                </tr>
                <tr>
                  <td>{GetMessage("customFields_label_match")}</td>
                  <td>{customField.match.join(", ")}</td>
                </tr>
                {customField.template && (
                  <tr>
                    <td>{GetMessage("customFields_label_template")}</td>
                    <td>{customField.template}</td>
                  </tr>
                )}
                {isNotEmpty(customField.min) && (
                  <tr>
                    <td>{GetMessage("customFields_label_minValue")}</td>
                    <td>
                      {customField.min}
                      {customField.type === "date" ? ` ${GetMessage("customFields_label_daysFromToday")}` : null}
                    </td>
                  </tr>
                )}
                {isNotEmpty(customField.minDate) && (
                  <tr>
                    <td>{GetMessage("customFields_label_minValue")}</td>
                    <td>{customField.minDate}</td>
                  </tr>
                )}
                {isNotEmpty(customField.max) && (
                  <tr>
                    <td>{GetMessage("customFields_label_maxValue")}</td>
                    <td>
                      {customField.max}
                      {customField.type === "date" ? ` ${GetMessage("customFields_label_daysFromToday")}` : null}
                    </td>
                  </tr>
                )}
                {isNotEmpty(customField.maxDate) && (
                  <tr>
                    <td>{GetMessage("customFields_label_maxValue")}</td>
                    <td>{customField.maxDate}</td>
                  </tr>
                )}
                {isNotZero(customField.decimalPlaces) && (
                  <tr>
                    <td>{GetMessage("customFields_label_decimalPlaces")}</td>
                    <td>{customField.decimalPlaces}</td>
                  </tr>
                )}
                {isNotEmpty(customField.maxLength) && (
                  <tr>
                    <td>{GetMessage("customFields_label_maxLength")}</td>
                    <td>{customField.maxLength}</td>
                  </tr>
                )}
                {customField.list && (
                  <tr>
                    <td>{GetMessage("customFields_label_listItems")}</td>
                    <td>{customField.list.join(", ")}</td>
                  </tr>
                )}
                {!!customField.emailPrefix && (
                  <tr>
                    <td>{GetMessage("customFields_label_emailUsernamePrefix")}</td>
                    <td>{customField.emailPrefix}</td>
                  </tr>
                )}
                {customField.emailUsername && (
                  <tr>
                    <td>{GetMessage("customFields_label_username")}</td>
                    <td>
                      {customField.emailUsername === "regex" && customField.emailUsernameRegEx}
                      {customField.emailUsername === "list" && customField.emailUsernameList?.join(", ")}
                      {customField.emailUsername === "random" && GetMessage("customFields_label_random")}
                      {customField.emailUsername === "username" && GetMessage("customFields_label_previousUsername")}
                      {customField.emailUsername === "name" && GetMessage("customFields_label_previousName")}
                    </td>
                  </tr>
                )}
                {customField.emailHostname && (
                  <tr>
                    <td>{GetMessage("customFields_label_hostname")}</td>
                    <td>
                      {customField.emailHostname === "list" && customField.emailHostnameList?.join(", ")}
                      {customField.emailHostname === "random" && GetMessage("customFields_label_random")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {props.allowAdd && (
            <AddFieldButton index={props.itemIndex + 1} onClick={props.onAdd} disabled={!props.allowAdd} />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default CustomFieldsListItem;
