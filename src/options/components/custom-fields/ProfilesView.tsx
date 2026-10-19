import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router";

import { GetMessage } from "src/common/helpers";
import { createProfile, deleteProfile, saveProfile, MyThunkDispatch } from "src/options/actions";
import ProfileModal from "src/options/components/custom-fields/ProfileModal";
import { IProfile } from "src/types";

type Props = {
  profileIndex: number;
  profiles: IProfile[];
  children?: React.ReactNode;
};

const ProfilesView: React.FC<Props> = (props) => {
  const { profiles, profileIndex } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [profile, setProfile] = useState<IProfile | undefined>();
  const [actionType, setActionType] = useState<"create" | "edit" | undefined>();

  const navigate = useNavigate();
  const dispatch = useDispatch<MyThunkDispatch>();

  function closeModal(): void {
    setModalIsOpen(false);
    setProfile(undefined);
    setActionType(undefined);
  }

  function newProfile(): void {
    setProfile(undefined);
    setActionType("create");
    setModalIsOpen(true);
  }

  function handleEdit(): void {
    setProfile(profiles[profileIndex]);
    setActionType("edit");
    setModalIsOpen(true);
  }

  function handleDelete(): void {
    if (profileIndex >= 0 && window.confirm(GetMessage("profile_delete_confirm_message"))) {
      dispatch(deleteProfile(profileIndex));
      navigate("/custom-fields");
    }
  }

  function handleSave(formValues: IProfile): void {
    if (actionType === "edit") {
      dispatch(saveProfile(formValues, profileIndex));
    } else {
      dispatch(createProfile(formValues));
    }
    closeModal();
  }

  return (
    <>
      <div className="row">
        <div className="col-3">
          <h3 className="h6">{GetMessage("profiles")}</h3>
          <nav className="nav nav-pills flex-column">
            <NavLink to="/custom-fields" className="nav-link" end>
              {GetMessage("profiles_default_name")}
            </NavLink>
            {profiles.map((p, index) => (
              <NavLink key={index} to={`/custom-fields/${index}`} className="nav-link" end>
                {p.name}
              </NavLink>
            ))}
          </nav>
          <p />
          <div className="text-center">
            <button type="button" className="btn btn-sm btn-link" onClick={newProfile}>
              {GetMessage("profiles_create_button_label")}
            </button>
          </div>
        </div>
        <div className="col-9">
          {profileIndex >= 0 && (
            <>
              <div className="float-end">
                <button type="button" className="btn btn-sm btn-link" onClick={handleEdit}>
                  <img src="images/edit.svg" width="12" height="12" alt={GetMessage("edit")} />
                </button>
              </div>
              <h3 className="h5">
                {GetMessage("profile")}: {profiles[profileIndex].name}
              </h3>
              <p className="text-muted">
                {GetMessage("profile_url_matching_expression")}: <code>{profiles[profileIndex].urlMatch}</code>
              </p>
            </>
          )}

          {props.children}

          {profileIndex >= 0 && (
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
