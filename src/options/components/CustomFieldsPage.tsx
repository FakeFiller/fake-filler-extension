import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GetMessage } from 'src/common/helpers';
import { getOptions } from 'src/options/actions';
import CustomFieldsView from 'src/options/components/custom-fields/CustomFieldsView';
import Introduction from 'src/options/components/custom-fields/Introduction';
import { IAppState, IFormFillerOptions } from 'src/types';

export default function CustomFieldsPage(): JSX.Element {
  const dispatch = useDispatch();

  const isFetching = useSelector<IAppState, boolean>(state => state.optionsData.isFetching);
  const options = useSelector<IAppState, IFormFillerOptions | null>(state => state.optionsData.options);

  useEffect(() => {
    dispatch(getOptions());
  }, [dispatch]);

  if (isFetching || options === null) {
    return <div>{GetMessage('loading')}</div>;
  }

  return (
    <>
      <h2>{GetMessage('customFields_title')}</h2>
      <Introduction />
      <hr />
      <CustomFieldsView customFields={options.fields} />
    </>
  );
}
