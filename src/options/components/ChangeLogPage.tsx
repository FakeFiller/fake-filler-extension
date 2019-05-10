import * as React from 'react';

import ExternalLink from './common/ExternalLink';

class ChangeLogPage extends React.PureComponent {
  public render(): JSX.Element {
    return (
      <div>
        <h2>Form Filler Changelog</h2>
        <p>
          <strong>Version 2.10.3</strong>
        </p>
        <ul>
          <li>
            Check name attribute before filling a radio input. (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/102">#102</ExternalLink>)
          </li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.10.2</strong>
        </p>
        <ul>
          <li>Revert pattern support.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.10.1</strong>
        </p>
        <ul>
          <li>Fixed message for keyboard shortcuts for Chrome.</li>
          <li>Allow input type="tel" fields to be filled using RegEx and Randomized List custom fields.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.10.0</strong>
        </p>
        <ul>
          <li>Use the pattern attribute to generate dummy data.</li>
          <li>Allow adding custom fields in the middle of the list.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.9.0</strong>
        </p>
        <ul>
          <li>Initial work for filling forms in SPAs.</li>
          <li>Textarea fields are matched using custom fields of type text, regex, alphanumeric or randomized list.</li>
          <li>Default maximum length option to limit text in fields that don't match any custom fields.</li>
          <li>Added option to match using the input field's placeholder value.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.10</strong>
        </p>
        <ul>
          <li>Fixed an error with sorting custom fields in Firefox.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.8</strong>
        </p>
        <ul>
          <li>
            Fixed a typo. (<ExternalLink url="https://github.com/husainshabbir/form-filler/pull/71">#71</ExternalLink>)
          </li>
          <li>
            Use all labels of fields for matching (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/66">#66</ExternalLink>
            ).
          </li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.7</strong>
        </p>
        <ul>
          <li>
            Fixed issue in setting select fields via custom field rules. (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/54">#54</ExternalLink>)
          </li>
          <li>Fixed issue with displaying keyboard shortcut descriptions in Chrome.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.6</strong>
        </p>
        <ul>
          <li>
            Added Chinese localization (<ExternalLink url="https://github.com/rowthan">rowthan</ExternalLink>)
          </li>
          <li>
            Data generation for textarea fields can be customized using Text, Alphanumeric, Regular Expression and
            Randomized List custom field types.
          </li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.5</strong>
        </p>
        <ul>
          <li>Workaround for Firefox problem with backup settings.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.4</strong>
        </p>
        <ul>
          <li>Fixed change tracking in custom fields.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.3</strong>
        </p>
        <ul>
          <li>Fixed issue in validating and saving Number custom field types.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.2</strong>
        </p>
        <ul>
          <li>Fixed a random number generation bug.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.1</strong>
        </p>
        <ul>
          <li>Options from the old version of the extension are migrated to the new one.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.8.0</strong>
        </p>
        <ul>
          <li>Added option to generate email username segment using regular expressions.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.7.0</strong>
        </p>
        <ul>
          <li>Form Filler is now on Firefox!</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.5.1</strong>
        </p>
        <ul>
          <li>
            Handling selects with a disabled selected value correctly. (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/33">#33</ExternalLink>)
          </li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.5.0</strong>
        </p>
        <ul>
          <li>
            Inputs of type <code>tel</code> and <code>number</code> can now be customized using custom fields. The
            custom fields take precedence over the attributes.
          </li>
          <li>Change event is now correctly fired.</li>
          <li>Fixed a bug that caused an incorrect color to be generated in some cases.</li>
          <li>Fixed a bug that caused incorrect field matching in some cases.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.4.4</strong>
        </p>
        <ul>
          <li>Fixed a bug that prevented some dropdown fields from being filled.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.4.5</strong>
        </p>
        <ul>
          <li>
            Fixed a call to a removed jQuery size() function call. (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/25">#25</ExternalLink>)
          </li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.4.3</strong>
        </p>
        <ul>
          <li>Keyboard shortcuts are shown in the options page with instructions on how to change them.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.4.2</strong>
        </p>
        <ul>
          <li>
            Added option to always check certain checkboxes (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/11">#11</ExternalLink>)
          </li>
          <li>
            Support for non-latin characters in Import and Export (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/18">#18</ExternalLink>)
          </li>
          <li>
            Added default keyboard shortcuts (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/20">#20</ExternalLink>)
          </li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.4.1</strong>
        </p>
        <ul>
          <li>
            Randomized list now works for select elements (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/10">#10</ExternalLink>
            ).
          </li>
          <li>Bug fix when generating telephone number.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.4.0</strong>
        </p>
        <ul>
          <li>
            Field matching now works with label text (
            <ExternalLink url="https://github.com/husainshabbir/form-filler/pull/5">#5</ExternalLink>
            ).
          </li>
          <li>Added an option to customize what attributes are used for matching.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.3.1</strong>
        </p>
        <ul>
          <li>Added support for filling forms inside iframes.</li>
          <li>Added an option to enable or disable the context menu.</li>
          <li>Added a new regular expression custom field data type.</li>
          <li>Bug fixes.</li>
        </ul>
        <p>
          <span className="label label-info">NOTE</span> If you have saved a backup of the settings, please take a fresh
          backup for the new settings to be included.
        </p>
        <hr />
        <p>
          <strong>Version 2.2.2</strong>
        </p>
        <ul>
          <li>Fixed an error caused by inputs with a missing type attribute.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.2.1</strong>
        </p>
        <ul>
          <li>Bug fixes.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.2.0</strong>
        </p>
        <ul>
          <li>Added support for importing and exporting settings.</li>
          <li>Added support for regular expressions in the match field.</li>
          <li>Added support for Form Filler to be invoked via the context menu.</li>
          <li>Added option to ignore fields that already have content.</li>
          <li>Extended the trigger click events feature to also trigger change events on text fields.</li>
          <li>
            Added a new custom field type: Randomized List. This allows you to fill an input field using a random value
            from a list you specify.
          </li>
          <li>Form Filler also fills contenteditable tags with dummy content.</li>
          <li>Bug fixes.</li>
        </ul>
        <p>
          <span className="label label-default">Known Issue</span> At the moment, Form Filler cannot fill forms that are
          loaded inside an iframe (even if you use the context menu).
        </p>
        <hr />
        <p>
          <strong>Version 2.1.0</strong>
        </p>
        <ul>
          <li>Added ability to trigger click events on radio buttons and checkboxes.</li>
        </ul>
        <hr />
        <p>
          <strong>Version 2.0.0</strong>
        </p>
        <ul>
          <li>Added support for custom fields</li>
          <li>Added alphanumeric data type</li>
          <li>Added option to customize the format for telephone numbers</li>
          <li>Added option to customize the format for date/time values</li>
          <li>Added option to set minimum and maximum values for numbers</li>
          <li>Added option to use username or first and last name for generating email address</li>
          <li>Added option to ignore hidden fields</li>
          <li>Improved support for HTML5 input types</li>
        </ul>
        <p>
          <span className="label label-info">NOTE</span> This version introduces custom fields for generating random
          data. Settings from previous versions cannot be migrated and will need to be set again.
        </p>
        <hr />
        <p>
          <strong>Version 1.3.0</strong>
        </p>
        <ul>
          <li>Added support for keyboard shortcut</li>
        </ul>
        <hr />
        <p>
          <strong>Version 1.2.0</strong>
        </p>
        <ul>
          <li>Select multiple values in a listbox</li>
          <li>Random text is generated using lorem ipsum text</li>
          <li>Respecting min and max values of HTML5 number and range fields</li>
          <li>Text fields are populated with a short phrase instead of a single word</li>
          <li>Generate sensible names for people and organizations</li>
          <li>Showing a message when closing the options page without saving changes</li>
        </ul>
        <p>&nbsp;</p>
      </div>
    );
  }
}

export default ChangeLogPage;
