import React, { PropTypes } from 'react';

import { shapeOfCustomField } from '../../prop-types';

const CustomFieldsList = ({ customFields, onDelete }) => {
  const customFieldItems = customFields.map((item, index) => (
    <div key={index} className="well well-sm">
      <strong>{item.name}</strong>
      <div className="pull-right">
        <div className="btn-group">
          <button type="button" className="btn btn-xs btn-default">
            <i className="glyphicon glyphicon-sort" />
          </button>
          <button type="button" className="btn btn-xs btn-default">
            <i className="glyphicon glyphicon-edit" /> Edit
          </button>
          <button type="button" className="btn btn-xs btn-default"onClick={() => onDelete(index)}>
            <i className="glyphicon glyphicon-trash" />
          </button>
        </div>
      </div>
      <dl className="dl-horizontal">
        <dt>Type</dt>
        <dd>{item.type}</dd>
        <dt>Match</dt>
        <dd>{item.match.join(', ')}</dd>
        {item.template && <dt>Template</dt>}
        {item.template && <dd>{item.template}</dd>}
        {item.min && <dt>Minimum Value</dt>}
        {item.min && <dd>{item.min}</dd>}
        {item.max && <dt>Maximum Value</dt>}
        {item.max && <dd>{item.max}</dd>}
      </dl>
    </div>
  ));

  return (
    <div>{customFieldItems}</div>
  );
};

CustomFieldsList.propTypes = {
  customFields: PropTypes.arrayOf(shapeOfCustomField),
  onDelete: PropTypes.func.isRequired,
};

export default CustomFieldsList;
