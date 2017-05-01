import React from 'react';

import { GetMessage } from '../../../form-filler/helpers';

const Introduction = () => (
  <div>
    <p>{GetMessage('customFields_intro')}</p>
    <p>
      <a
        href="https://github.com/husainshabbir/form-filler/wiki/Custom-Fields-Matching"
        target="_blank"
        rel="noopener noreferrer"
      >
        <b>{GetMessage('customFields_getMoreInfo')}</b>
      </a>
    </p>
  </div>
);

export default Introduction;
