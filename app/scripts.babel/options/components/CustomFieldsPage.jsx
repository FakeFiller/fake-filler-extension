import React from 'react';
import { Link } from 'react-router';

const CustomFieldsPage = () => (
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
  </div>
);

export default CustomFieldsPage;
