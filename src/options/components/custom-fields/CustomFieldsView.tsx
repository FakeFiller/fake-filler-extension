import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { GetMessage } from "src/common/helpers";
import { createCustomField, deleteCustomField, saveCustomField, saveSortedCustomFields } from "src/options/actions";
import CustomFieldModal from "src/options/components/custom-fields/CustomFieldModal";
import CustomFieldsList from "src/options/components/custom-fields/CustomFieldsList";
import GetProModal from "src/options/components/custom-fields/GetProModal";
import { ICustomField, ICustomFieldForm } from "src/types";

type Props = {
  isProEdition: boolean;
  profileIndex: number;
  customFields: ICustomField[];
};

const MAX_CUSTOM_FIELDS = 25;

export default function CustomFieldsView(props: Props): JSX.Element {
  const { isProEdition, profileIndex, customFields } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [getProModalIsOpen, setGetProModalIsOpen] = useState(false);
  const [customFieldIndex, setCustomFieldIndex] = useState(-1);
  const [customField, setCustomField] = useState<ICustomField | null>(null);
  const [actionType, setActionType] = useState<"create" | "edit" | undefined>();

  const dispatch = useDispatch();

  const allowAdd = isProEdition || profileIndex === -1;
  const allowEdit = isProEdition || profileIndex === -1;

  function closeModal(): void {
    setModalIsOpen(false);
    setCustomField(null);
    setActionType(undefined);
    setCustomFieldIndex(-1);
  }

  function newCustomField(index: number): void {
    if (allowEdit) {
      if (!isProEdition && props.customFields.length >= MAX_CUSTOM_FIELDS) {
        setGetProModalIsOpen(true);
      } else {
        setCustomFieldIndex(index);
        setActionType("create");
        setCustomField(null);
        setModalIsOpen(true);
      }
    }
  }

  function handleEdit(currentCustomField: ICustomField, index: number): void {
    if (allowEdit) {
      setCustomFieldIndex(index);
      setCustomField(currentCustomField);
      setActionType("edit");
      setModalIsOpen(true);
    }
  }

  function handleDelete(index: number): void {
    if (allowEdit) {
      // eslint-disable-next-line no-alert
      if (window.confirm(GetMessage("customFields_delete_confirm_message"))) {
        dispatch(deleteCustomField(index, profileIndex));
      }
    }
  }

  function handleSort(sortedCustomFields: ICustomField[]): void {
    if (allowEdit) {
      dispatch(saveSortedCustomFields(sortedCustomFields, profileIndex));
    }
  }

  function handleSave(formValues: ICustomFieldForm): void {
    if (allowEdit) {
      if (actionType === "edit") {
        dispatch(saveCustomField(formValues, customFieldIndex, profileIndex));
      } else {
        dispatch(createCustomField(formValues, customFieldIndex, profileIndex));
      }
      closeModal();
    }
  }

  return (
    <>
      <CustomFieldsList
        customFields={customFields}
        allowAdd={allowAdd}
        allowEdit={allowEdit}
        onAdd={newCustomField}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
      />

      <CustomFieldModal isOpen={modalIsOpen} customField={customField} onClose={closeModal} onSave={handleSave} />
      <GetProModal isOpen={getProModalIsOpen} onClose={() => setGetProModalIsOpen(false)} />
    </>
  );
}
