import * as React from 'react';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';

import CustomFieldsListItem from './CustomFieldsListItem';

interface ISortableItemProps {
  customField: ICustomField;
  itemIndex: number;
  onEdit: CustomFieldEditFunction;
  onDelete: CustomFieldDeleteFunction;
}

const SortableItem = SortableElement<ISortableItemProps>(({ customField, itemIndex, onEdit, onDelete }) => (
  <CustomFieldsListItem customField={customField} itemIndex={itemIndex} onEdit={onEdit} onDelete={onDelete} />
));

interface ISortableCustomFieldsListProps {
  customFields: ICustomField[];
  onEdit: CustomFieldEditFunction;
  onDelete: CustomFieldDeleteFunction;
}

const SortableCustomFieldsList = SortableContainer<ISortableCustomFieldsListProps>(
  ({ customFields, onEdit, onDelete }) => {
    const customFieldItems = customFields.map((item, index) => (
      <SortableItem
        key={index}
        index={index}
        itemIndex={index}
        customField={item}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ));

    return <div className="custom-fields-list">{customFieldItems}</div>;
  },
);

interface IOwnProps {
  customFields: ICustomField[];
  onDelete: CustomFieldDeleteFunction;
  onEdit: CustomFieldEditFunction;
  onSort: CustomFieldSortFunction;
}

class CustomFieldsList extends React.PureComponent<IOwnProps> {
  constructor(props: IOwnProps) {
    super(props);

    this.onSortEnd = this.onSortEnd.bind(this);
  }

  private onSortEnd({ oldIndex, newIndex }: SortEnd): void {
    const sortedCustomFields = arrayMove(this.props.customFields, oldIndex, newIndex);
    this.props.onSort(sortedCustomFields);
  }

  public render(): JSX.Element {
    return (
      <SortableCustomFieldsList
        customFields={this.props.customFields}
        onEdit={this.props.onEdit}
        onDelete={this.props.onDelete}
        onSortEnd={this.onSortEnd}
        useDragHandle
        useWindowAsScrollContainer
        lockAxis="y"
      />
    );
  }
}

export default CustomFieldsList;
