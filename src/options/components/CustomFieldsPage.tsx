import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";

import { GetMessage } from "src/common/helpers";
import { getOptions, MyThunkDispatch } from "src/options/actions";
import CustomFieldsView from "src/options/components/custom-fields/CustomFieldsView";
import Introduction from "src/options/components/custom-fields/Introduction";
import ProfilesView from "src/options/components/custom-fields/ProfilesView";
import { IAppState, IFakeFillerOptions, ICustomField } from "src/types";

export default function CustomFieldsPage(): React.JSX.Element {
  const dispatch = useDispatch<MyThunkDispatch>();

  const { index } = useParams<{ index: string }>();
  const profileIndex = parseInt(String(index || -1), 10);

  const isFetching = useSelector<IAppState, boolean>((state) => state.optionsData.isFetching);
  const options = useSelector<IAppState, IFakeFillerOptions | null>((state) => state.optionsData.options);

  useEffect(() => {
    dispatch(getOptions());
  }, [dispatch]);

  if (isFetching || options === null) {
    return <div>{GetMessage("loading")}</div>;
  }

  let customFieldsList: ICustomField[];

  if (profileIndex < 0) {
    customFieldsList = options.fields;
  } else if (profileIndex < options.profiles.length) {
    customFieldsList = options.profiles[profileIndex].fields;
  } else {
    return <Navigate to="/custom-fields" replace />;
  }

  return (
    <>
      <h2>{GetMessage("customFields_title")}</h2>
      <Introduction />
      <hr />
      <ProfilesView profileIndex={profileIndex} profiles={options.profiles || []}>
        <CustomFieldsView customFields={customFieldsList} profileIndex={profileIndex} />
      </ProfilesView>
    </>
  );
}
