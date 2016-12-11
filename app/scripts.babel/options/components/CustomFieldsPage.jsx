import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import CustomFieldsList from './custom-fields/CustomFieldsList';
import { getOptions, deleteCustomField, saveSortedCustomFields } from '../actions';
import { shapeOfOptions } from '../prop-types';

class CustomFieldsPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;

    this.handleDelete = this.handleDelete.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.dispatch(getOptions());
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

  render() {
    if (this.props.isFetching) {
      return (<div>Loading...</div>);
    }

    return (
      <div>
        <h2>Custom Fields</h2>
        <p>
          Form Filler can use the ID, NAME and CLASS values of an input field in
          addition to the label text to determine its data type. You can adjust
          the search phrases in the Match field to tweak how Form Filler
          determines the correct data types.
        </p>
        <p>
          Basically, any partial match in the attributes underlined:<br />
          <code>&lt;label for=&quot;match&quot;&gt;<b><u>match</u></b>&lt;/label&gt;</code><br />
          <code>&lt;input type=&quot;<i>anything</i>&quot; id=&quot;<b><u>match</u></b>&quot;
          name=&quot;<b><u>match</u></b>&quot; class=&quot;<b><u>match</u></b>&quot; /&gt;</code>
        </p>
        <p>
          You can determine what Form Filler will use to match input fields by
          changing the settings in the <Link to="/">General</Link> section.
        </p>
        <p>
          When creating custom fields, and deciding what to put in the Match
          field, please note that:
        </p>
        <ul>
          <li>
            Attributes take precedence over any configuration and may override
            it in some cases,
          </li>
          <li>
            The fields are matched based on the order of the custom fields, and
          </li>
          <li>
            All punctuations are removed before being matched (e.g. user_name
            will become username).
          </li>
        </ul>
        <hr />
        <p>
          <button className="btn btn-sm btn-primary">
            <i className="glyphicon glyphicon-plus-sign" /> Add Field
          </button>
        </p>
        <CustomFieldsList
          customFields={this.props.options.fields}
          onDelete={this.handleDelete}
          onSort={this.handleSort}
        />
      </div>
    );
  }
}

CustomFieldsPage.propTypes = {
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

export default connect(mapStateToProps)(CustomFieldsPage);
