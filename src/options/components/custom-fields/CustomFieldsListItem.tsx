import * as React from "react";
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

interface IOwnProps {
  customField: ICustomField;
  itemIndex: number;
  onAdd: CustomFieldAddFunction;
  onEdit: CustomFieldEditFunction;
  onDelete: CustomFieldDeleteFunction;
}

class CustomFieldsListItem extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  private handleEdit(): void {
    this.props.onEdit(this.props.customField, this.props.itemIndex);
  }

  private handleDelete(): void {
    this.props.onDelete(this.props.itemIndex);
  }

  public render(): JSX.Element {
    const { customField } = this.props;

    return (
      <Draggable draggableId={`draggable-${this.props.itemIndex}`} index={this.props.itemIndex}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div className="card custom-field">
              <div className="card-header">
                <strong>{customField.name}</strong>
                <div className="custom-field-buttons">
                  <div className="btn btn-sm btn-link drag-handle" {...provided.dragHandleProps}>
                    <img src="images/move.svg" width="12" height="12" alt={GetMessage("move")} />
                  </div>
                  <button type="button" className="btn btn-sm btn-link" onClick={this.handleEdit}>
                    <img src="images/edit.svg" width="12" height="12" alt={GetMessage("edit")} />
                  </button>
                  <button type="button" className="btn btn-sm btn-link" onClick={this.handleDelete}>
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
                </tbody>
              </table>
            </div>
            <AddFieldButton index={this.props.itemIndex + 1} onClick={this.props.onAdd} />
          </div>
        )}
      </Draggable>
    );
  }
}

export default CustomFieldsListItem;
