import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import AddFieldButton from "src/options/components/custom-fields/AddFieldButton";
import CustomFieldsListItem from "src/options/components/custom-fields/CustomFieldsListItem";

import {
  ICustomField,
  CustomFieldAddFunction,
  CustomFieldDeleteFunction,
  CustomFieldEditFunction,
  CustomFieldSortFunction,
} from "src/types";

function reorder(list: ICustomField[], startIndex: number, endIndex: number): ICustomField[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

interface IOwnProps {
  customFields: ICustomField[];
  onAdd: CustomFieldAddFunction;
  onDelete: CustomFieldDeleteFunction;
  onEdit: CustomFieldEditFunction;
  onSort: CustomFieldSortFunction;
}

class CustomFieldsList extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.onSortEnd = this.onSortEnd.bind(this);
  }

  private onSortEnd(result: DropResult): void {
    if (!result.destination) {
      return;
    }

    const sortedCustomFields = reorder(this.props.customFields, result.source.index, result.destination.index);
    this.props.onSort(sortedCustomFields);
  }

  public render(): JSX.Element {
    return (
      <>
        <AddFieldButton index={0} onClick={this.props.onAdd} />
        <DragDropContext onDragEnd={this.onSortEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div className="custom-fields-list" ref={provided.innerRef} {...provided.droppableProps}>
                {this.props.customFields.map((item, index) => (
                  <CustomFieldsListItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    customField={item}
                    itemIndex={index}
                    onAdd={this.props.onAdd}
                    onEdit={this.props.onEdit}
                    onDelete={this.props.onDelete}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
}

export default CustomFieldsList;
