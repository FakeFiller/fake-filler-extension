import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Introduction from './custom-fields/Introduction';
import CustomFieldsList from './custom-fields/CustomFieldsList';
import CustomFieldModal from './custom-fields/CustomFieldModal';
import { getOptions, deleteCustomField, saveCustomField, saveSortedCustomFields } from '../actions';
import { shapeOfOptions } from '../prop-types';
import { GetMessage } from '../../form-filler/helpers';

class CustomFieldsPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;

    this.state = {
      modalIsOpen: false,
      customField: {},
      customFieldIndex: -1,
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.newCustomField = this.newCustomField.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.dispatch(getOptions());
  }

  handleEdit(customField, index) {
    this.setState({
      modalIsOpen: true,
      customFieldIndex: index,
      customField,
    });
  }

  handleDelete(index) {
    // eslint-disable-next-line no-alert
    if (confirm('Are you sure you want to delete this custom field?')) {
      this.dispatch(deleteCustomField(this.props.options, index));
    }
  }

  handleSort(sortedCustomFields) {
    this.dispatch(saveSortedCustomFields(this.props.options, sortedCustomFields));
  }

  handleSave(customField) {
    this.dispatch(saveCustomField(this.props.options, customField, this.state.customFieldIndex));
    this.closeModal();
  }

  newCustomField() {
    this.setState({
      modalIsOpen: true,
      customFieldIndex: -1,
      customField: {},
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      customFieldIndex: -1,
      customField: {},
    });
  }

  render() {
    if (this.props.isFetching) {
      return (<div>{GetMessage('loading')}</div>);
    }

    return (
      <div>
        <h2>{GetMessage('customFields_title')}</h2>
        <Introduction />
        <hr />
        <p>
          <button className="btn btn-sm btn-primary" onClick={this.newCustomField}>
            <i className="glyphicon glyphicon-plus-sign" /> {GetMessage('customFields_addFieldButtonText')}
          </button>
        </p>
        <CustomFieldsList
          customFields={this.props.options.fields}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}
          onSort={this.handleSort}
        />
        <CustomFieldModal
          modalIsOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
          customField={this.state.customField}
          onSave={this.handleSave}
        />
      </div>
    );
  }
}

CustomFieldsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  options: shapeOfOptions,
  isFetching: PropTypes.bool.isRequired,
};

CustomFieldsPage.defaultProps = {
  options: null,
};

function mapStateToProps(state) {
  const options = state.OptionsReducer.options;

  if (options) {
    return {
      isFetching: state.OptionsReducer.isFetching,
      options,
    };
  }

  return {
    isFetching: true,
    options: null,
  };
}

export default connect(mapStateToProps)(CustomFieldsPage);
