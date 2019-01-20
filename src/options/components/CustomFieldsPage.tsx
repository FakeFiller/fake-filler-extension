import * as React from 'react';
import { connect } from 'react-redux';

import { GetMessage } from '../../common/helpers';
import { deleteCustomField, DispatchProps, getOptions, saveCustomField, saveSortedCustomFields } from '../actions';

import CustomFieldModal from './custom-fields/CustomFieldModal';
import CustomFieldsList from './custom-fields/CustomFieldsList';
import Introduction from './custom-fields/Introduction';

interface IState {
  modalIsOpen: boolean;
  customField: ICustomField | null;
  customFieldIndex: number;
}

interface IOwnProps {}

interface IStateProps {
  isFetching: boolean;
  options: IFormFillerOptions | null;
}

interface IProps extends DispatchProps, IOwnProps, IStateProps {}

class CustomFieldsPage extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      modalIsOpen: false,
      customField: null,
      customFieldIndex: -1,
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.newCustomField = this.newCustomField.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  private handleEdit(customField: ICustomField, index: number): void {
    this.setState({
      modalIsOpen: true,
      customFieldIndex: index,
      customField,
    });
  }

  private handleDelete(index: number): void {
    if (confirm('Are you sure you want to delete this custom field?')) {
      // @ts-ignore
      this.props.dispatch(deleteCustomField(this.props.options, index));
    }
  }

  private handleSort(sortedCustomFields: ICustomField[]): void {
    // @ts-ignore
    this.props.dispatch(saveSortedCustomFields(this.props.options, sortedCustomFields));
  }

  private handleSave(formValues: ICustomFieldForm): void {
    // @ts-ignore
    this.props.dispatch(saveCustomField(this.props.options, formValues, this.state.customFieldIndex));
    this.closeModal();
  }

  private newCustomField(): void {
    this.setState({
      modalIsOpen: true,
      customFieldIndex: -1,
      customField: null,
    });
  }

  private closeModal(): void {
    this.setState({
      modalIsOpen: false,
      customFieldIndex: -1,
      customField: null,
    });
  }

  public componentDidMount(): void {
    this.props.dispatch(getOptions());
  }

  public render(): JSX.Element {
    if (this.props.isFetching || this.props.options === null) {
      return <div>{GetMessage('loading')}</div>;
    }

    return (
      <div>
        <h2>{GetMessage('customFields_title')}</h2>
        <Introduction />
        <hr />
        <p>
          <button className="btn btn-sm btn-primary" onClick={this.newCustomField}>
            {GetMessage('customFields_addFieldButtonText')}
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
          customField={this.state.customField}
          onClose={this.closeModal}
          onSave={this.handleSave}
        />
      </div>
    );
  }
}

function mapStateToProps(state: IAppState): IStateProps {
  const options = state.optionsData.options;

  if (options) {
    return {
      isFetching: state.optionsData.isFetching,
      options,
    };
  }

  return {
    isFetching: true,
    options: null,
  };
}

export default connect(mapStateToProps)(CustomFieldsPage) as React.ComponentClass<IOwnProps>;
