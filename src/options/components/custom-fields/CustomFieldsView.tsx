import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { GetMessage } from "src/common/helpers";
import {
  createCustomField,
  deleteCustomField,
  saveCustomField,
  saveSortedCustomFields,
  MyThunkDispatch,
} from "src/options/actions";
import CustomFieldModal from "src/options/components/custom-fields/CustomFieldModal";
import CustomFieldsList from "src/options/components/custom-fields/CustomFieldsList";
import { ICustomField, ICustomFieldForm } from "src/types";

type Props = {
  profileIndex: number;
  customFields: ICustomField[];
};

export default function CustomFieldsView(props: Props): React.JSX.Element {
  const { profileIndex, customFields } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [customFieldIndex, setCustomFieldIndex] = useState(-1);
  const [customField, setCustomField] = useState<ICustomField | null>(null);
  const [actionType, setActionType] = useState<"create" | "edit" | undefined>();

  const dispatch = useDispatch<MyThunkDispatch>();

  function closeModal(): void {
    setModalIsOpen(false);
    setCustomField(null);
    setActionType(undefined);
    setCustomFieldIndex(-1);
  }

  function newCustomField(index: number): void {
    setCustomFieldIndex(index);
    setActionType("create");
    setCustomField(null);
    setModalIsOpen(true);
  }

  function handleEdit(currentCustomField: ICustomField, index: number): void {
    setCustomFieldIndex(index);
    setCustomField(currentCustomField);
    setActionType("edit");
    setModalIsOpen(true);
  }

  function handleDelete(index: number): void {
    if (window.confirm(GetMessage("customFields_delete_confirm_message"))) {
      dispatch(deleteCustomField(index, profileIndex));
    }
  }

  function handleSort(sortedCustomFields: ICustomField[]): void {
    dispatch(saveSortedCustomFields(sortedCustomFields, profileIndex));
  }

  function handleSave(formValues: ICustomFieldForm): void {
    if (actionType === "edit") {
      dispatch(saveCustomField(formValues, customFieldIndex, profileIndex));
    } else {
      dispatch(createCustomField(formValues, customFieldIndex, profileIndex));
    }
    closeModal();
  }

  // Every edition can add unlimited fields, to the default list and to URL-specific profiles.
  return (
    <>
      <CustomFieldsList
        customFields={customFields}
        allowAdd
        allowEdit
        onAdd={newCustomField}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
      />

      <CustomFieldModal isOpen={modalIsOpen} customField={customField} onClose={closeModal} onSave={handleSave} />
    </>
  );
}
