import * as React from "react";
import { connect } from "react-redux";

import { GetMessage } from "src/common/helpers";
import { DispatchProps, getOptions, saveOptions } from "src/options/actions";
import GeneralSettingsForm from "src/options/components/general-settings/GeneralSettingsForm";
import { IFormFillerOptions, IFormFillerOptionsForm, IAppState } from "src/types";

interface IState {
  showSavedMessage: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IOwnProps {}

interface IStateProps {
  isFetching: boolean;
  options: IFormFillerOptions | null;
}

interface IProps extends DispatchProps, IOwnProps, IStateProps {}

class GeneralSettingsPage extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      showSavedMessage: false,
    };

    this.handleSave = this.handleSave.bind(this);
  }

  public componentDidMount(): void {
    this.props.dispatch(getOptions());
  }

  private handleSave(formValues: IFormFillerOptionsForm): void {
    if (this.props.options) {
      this.props.dispatch(saveOptions(this.props.options, formValues));

      this.setState({
        showSavedMessage: true,
      });
    }
  }

  public render(): JSX.Element {
    if (this.props.isFetching || this.props.options === null) {
      return <div>{GetMessage("loading")}</div>;
    }

    return (
      <GeneralSettingsForm
        options={this.props.options}
        showSavedMessage={this.state.showSavedMessage}
        onSave={this.handleSave}
      />
    );
  }
}

function mapStateToProps(state: IAppState): IStateProps {
  return {
    isFetching: state.optionsData.isFetching,
    options: state.optionsData.options,
  };
}

export default connect(mapStateToProps)(GeneralSettingsPage);
