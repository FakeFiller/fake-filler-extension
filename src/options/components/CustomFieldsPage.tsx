import * as React from 'react';
import { connect } from 'react-redux';

import { GetMessage } from '../../common/helpers';
import {
  createCustomField,
  deleteCustomField,
  DispatchProps,
  getOptions,
  saveCustomField,
  saveSortedCustomFields,
} from '../actions';

import AddFieldButton from './custom-fields/AddFieldButton';
import CustomFieldModal from './custom-fields/CustomFieldModal';
import CustomFieldsList from './custom-fields/CustomFieldsList';
import Introduction from './custom-fields/Introduction';

interface IState {
  modalIsOpen: boolean;
  customField: ICustomField | null;
  customFieldIndex: number;
  actionType: 'create' | 'edit' | undefined;
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
      actionType: undefined,
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
      actionType: 'edit',
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
    if (this.state.actionType === 'edit') {
      // @ts-ignore
      this.props.dispatch(saveCustomField(this.props.options, formValues, this.state.customFieldIndex));
    } else {
      // @ts-ignore
      this.props.dispatch(createCustomField(this.props.options, formValues, this.state.customFieldIndex));
    }

    this.closeModal();
  }

  private newCustomField(index: number): void {
    this.setState({
      modalIsOpen: true,
      customFieldIndex: index,
      customField: null,
      actionType: 'create',
    });
  }

  private closeModal(): void {
    this.setState({
      modalIsOpen: false,
      customFieldIndex: 0,
      customField: null,
      actionType: undefined,
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
        <AddFieldButton index={0} onClick={this.newCustomField} />
        <CustomFieldsList
          customFields={this.props.options.fields}
          onAdd={this.newCustomField}
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
