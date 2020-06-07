import React from "react";
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

type Props = {
  customFields: ICustomField[];
  allowAdd: boolean;
  allowEdit: boolean;
  onAdd: CustomFieldAddFunction;
  onDelete: CustomFieldDeleteFunction;
  onEdit: CustomFieldEditFunction;
  onSort: CustomFieldSortFunction;
};

const CustomFieldsList = (props: Props) => {
  function onSortEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const sortedCustomFields = reorder(props.customFields, result.source.index, result.destination.index);
    props.onSort(sortedCustomFields);
  }

  return (
    <>
      <AddFieldButton index={0} onClick={props.onAdd} disabled={!props.allowAdd} />
      <DragDropContext onDragEnd={onSortEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div className="custom-fields-list" ref={provided.innerRef} {...provided.droppableProps}>
              {props.customFields.map((item, index) => (
                <CustomFieldsListItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  customField={item}
                  itemIndex={index}
                  allowAdd={props.allowAdd}
                  allowEdit={props.allowEdit}
                  onAdd={props.onAdd}
                  onEdit={props.onEdit}
                  onDelete={props.onDelete}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default CustomFieldsList;
