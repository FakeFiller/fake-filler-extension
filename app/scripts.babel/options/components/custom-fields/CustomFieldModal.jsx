import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

import CustomFieldForm from './CustomFieldForm';
import { shapeOfCustomField } from '../../prop-types';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

class CustomFieldModal extends Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClose() {
    this.props.closeModal();
  }

  handleSubmit(customField) {
    this.props.onSave(customField);
  }

  render() {
    const customField = this.props.customField;

    return (
      <Modal
        className="modal-dialog"
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.handleClose}
        contentLabel="Custom Field Modal"
        style={customStyles}
      >
        <CustomFieldForm
          customField={customField}
          onSubmit={this.handleSubmit}
          onClose={this.handleClose}
        />
      </Modal>
    );
  }
}

CustomFieldModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  customField: shapeOfCustomField.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CustomFieldModal;
