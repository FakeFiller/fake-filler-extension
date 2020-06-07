import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";

import { GetMessage } from "src/common/helpers";
import { createProfile, deleteProfile, saveProfile } from "src/options/actions";
import ProfileModal from "src/options/components/custom-fields/ProfileModal";
import { IProfile } from "src/types";

type Props = {
  isProEdition: boolean;
  profileIndex: number;
  profiles: IProfile[];
};

const ProfilesView: React.FC<Props> = (props) => {
  const { isProEdition, profiles, profileIndex } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [profile, setProfile] = useState<IProfile | undefined>();
  const [actionType, setActionType] = useState<"create" | "edit" | undefined>();

  const history = useHistory();
  const dispatch = useDispatch();

  function closeModal(): void {
    setModalIsOpen(false);
    setProfile(undefined);
    setActionType(undefined);
  }

  function newProfile(): void {
    if (isProEdition) {
      setProfile(undefined);
      setActionType("create");
      setModalIsOpen(true);
    }
  }

  function handleEdit(): void {
    if (isProEdition) {
      setProfile(profiles[profileIndex]);
      setActionType("edit");
      setModalIsOpen(true);
    }
  }

  function handleDelete(): void {
    if (isProEdition) {
      // eslint-disable-next-line no-alert
      if (profileIndex >= 0 && window.confirm(GetMessage("profile_delete_confirm_message"))) {
        dispatch(deleteProfile(profileIndex));
        history.push("/custom-fields");
      }
    }
  }

  function handleSave(formValues: IProfile): void {
    if (isProEdition) {
      if (actionType === "edit") {
        dispatch(saveProfile(formValues, profileIndex));
      } else {
        dispatch(createProfile(formValues));
      }
      closeModal();
    }
  }

  if (!isProEdition && profiles.length === 0) {
    return <>{props.children}</>;
  }

  return (
    <>
      <div className="row">
        <div className="col-3">
          <h3 className="h6">{GetMessage("profiles")}</h3>
          <nav className="nav nav-pills flex-column">
            <NavLink to="/custom-fields" className="nav-link" exact>
              {GetMessage("profiles_default_name")}
            </NavLink>
            {profiles.map((p, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <NavLink key={index} to={`/custom-fields/${index}`} className="nav-link" exact>
                {p.name}
              </NavLink>
            ))}
          </nav>
          {isProEdition && (
            <>
              <p />
              <div className="text-center">
                <button type="button" className="btn btn-sm btn-link" onClick={newProfile}>
                  {GetMessage("profiles_create_button_label")}
                </button>
              </div>
            </>
          )}
        </div>
        <div className="col-9">
          {profileIndex >= 0 && (
            <>
              {isProEdition && (
                <div className="float-right">
                  <button type="button" className="btn btn-sm btn-link" onClick={handleEdit}>
                    <img src="images/edit.svg" width="12" height="12" alt={GetMessage("edit")} />
                  </button>
                </div>
              )}
              <h3 className="h5">
                {GetMessage("profile")}: {profiles[profileIndex].name}
              </h3>
              <p className="text-muted">
                {GetMessage("profile_url_matching_expression")}: <code>{profiles[profileIndex].urlMatch}</code>
              </p>
            </>
          )}

          {props.children}

          {isProEdition && profileIndex >= 0 && (
            <div className="text-center mt-5">
              <button type="button" onClick={handleDelete} className="btn btn-sm btn-outline-danger">
                {GetMessage("profiles_delete_button_label")}
              </button>
            </div>
          )}
        </div>
      </div>

      <ProfileModal isOpen={modalIsOpen} onClose={closeModal} onSave={handleSave} profile={profile} />
    </>
  );
};

export default ProfilesView;
