import * as React from 'react';
import * as Modal from 'react-modal';

import CustomFieldForm from 'src/options/components/custom-fields/CustomFieldForm';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

interface IOwnProps {
  customField: ICustomField | null;
  modalIsOpen: boolean;
  onClose: () => void;
  onSave: (formValues: ICustomFieldForm) => void;
}

class CustomFieldModal extends React.PureComponent<IOwnProps> {
  public render(): JSX.Element {
    return (
      <Modal
        className="modal-dialog modal-lg"
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.props.onClose}
        contentLabel="Custom Field Modal"
        closeTimeoutMS={200}
        style={customStyles}
      >
        <CustomFieldForm
          customField={this.props.customField}
          onSubmit={this.props.onSave}
          onClose={this.props.onClose}
        />
      </Modal>
    );
  }
}

export default CustomFieldModal;
