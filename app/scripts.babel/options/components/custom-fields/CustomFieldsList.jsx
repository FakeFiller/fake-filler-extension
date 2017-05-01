/* eslint-disable react/no-array-index-key */

import React, { Component, PropTypes } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';

import { shapeOfCustomField } from '../../prop-types';
import { GetMessage } from '../../../form-filler/helpers';

function isNotEmpty(item) {
  return item !== undefined && item !== null;
}

const DragHandle = SortableHandle(() => (
  <button type="button" className="btn btn-xs btn-default">
    <i className="glyphicon glyphicon-sort" />
  </button>
));

const SortableItem = SortableElement(({ customField, itemIndex, onEdit, onDelete }) => (
  <div className="well well-sm">
    <strong>{customField.name}</strong>
    <div className="pull-right">
      <div className="btn-group">
        <DragHandle />
        <button className="btn btn-xs btn-default" onClick={() => onEdit(customField, itemIndex)}>
          <i className="glyphicon glyphicon-edit" /> {GetMessage('edit')}
        </button>
        <button className="btn btn-xs btn-default" onClick={() => onDelete(itemIndex)}>
          <i className="glyphicon glyphicon-trash" />
        </button>
      </div>
    </div>
    <dl className="dl-horizontal">
      <dt>{GetMessage('customFields_label_dataType')}</dt>
      <dd>{customField.type}</dd>
      <dt>{GetMessage('customFields_label_match')}</dt>
      <dd>{customField.match.join(', ')}</dd>
      { customField.template && <dt>{GetMessage('customFields_label_template')}</dt> }
      { customField.template && <dd>{customField.template}</dd> }
      { isNotEmpty(customField.min) && <dt>{GetMessage('customFields_label_minValue')}</dt> }
      { isNotEmpty(customField.min) && <dd>{customField.min}</dd> }
      { isNotEmpty(customField.max) && <dt>{GetMessage('customFields_label_minValue')}</dt> }
      { isNotEmpty(customField.max) && <dd>{customField.max}</dd> }
      { customField.list && <dt>{GetMessage('customFields_label_listItems')}</dt> }
      { customField.list && <dd>{customField.list.join(', ')}</dd> }
    </dl>
  </div>
));

const SortableCustomFieldsList = SortableContainer(({ customFields, onEdit, onDelete }) => {
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

  return (
    <div>{customFieldItems}</div>
  );
});

class CustomFieldsList extends Component {
  constructor(props) {
    super(props);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  onSortEnd({ oldIndex, newIndex }) {
    const sortedCustomFields = arrayMove(this.props.customFields, oldIndex, newIndex);
    this.props.onSort(sortedCustomFields);
  }

  render() {
    return (
      <SortableCustomFieldsList
        customFields={this.props.customFields}
        onEdit={this.props.onEdit}
        onDelete={this.props.onDelete}
        onSortEnd={this.onSortEnd}
        useDragHandle
        useWindowAsScrollContainer
      />
    );
  }
}

CustomFieldsList.propTypes = {
  customFields: PropTypes.arrayOf(shapeOfCustomField),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
};

CustomFieldsList.defaultProps = {
  customFields: [],
};

export default CustomFieldsList;
