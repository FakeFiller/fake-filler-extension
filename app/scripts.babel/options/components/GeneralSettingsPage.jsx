import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import GeneralSettingsForm from './general-settings/GeneralSettingsForm';
import { getOptions, saveOptions } from '../actions';
import { CsvToArray } from '../../form-filler/helpers';
import { shapeOfOptions } from '../prop-types';

class GeneralSettingsPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;

    this.state = {
      showSavedMessage: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    this.dispatch(getOptions());
  }

  handleSubmit(options) {
    const preparedOptions = Object.assign({}, options, {
      emailSettings: Object.assign({}, options.emailSettings, {
        usernameList: CsvToArray(options.emailSettings.usernameList),
        hostnameList: CsvToArray(options.emailSettings.hostnameList),
      }),
      ignoredFields: CsvToArray(options.ignoredFields),
      confirmFields: CsvToArray(options.confirmFields),
      agreeTermsFields: CsvToArray(options.agreeTermsFields),
    });

    this.dispatch(saveOptions(preparedOptions));

    this.setState({
      showSavedMessage: true,
    });

    setTimeout(() => {
      this.setState({
        showSavedMessage: false,
      });
    }, 5000);
  }

  handleReset() {
    this.dispatch(reset('settingsForm'));
  }

  render() {
    if (this.props.isFetching) {
      return (<div>Loading...</div>);
    }

    const options = this.props.options;

    const initData = Object.assign({}, options, {
      emailSettings: Object.assign({}, options.emailSettings, {
        usernameList: options.emailSettings.usernameList.join(', '),
        hostnameList: options.emailSettings.hostnameList.join(', '),
      }),
      ignoredFields: options.ignoredFields.join(', '),
      confirmFields: options.confirmFields.join(', '),
      agreeTermsFields: options.agreeTermsFields.join(', '),
    });

    const initialValues = {
      initialValues: initData,
    };

    return (
      <GeneralSettingsForm
        options={options}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
        showSavedMessage={this.state.showSavedMessage}
        {...initialValues}
      />
    );
  }
}

GeneralSettingsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  options: shapeOfOptions,
  isFetching: PropTypes.bool,
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

export default connect(mapStateToProps)(GeneralSettingsPage);
