import { Form, Formik, FormikErrors } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";

import { GetMessage } from "src/common/helpers";
import TextField from "src/options/components/common/TextField";
import { IProfile } from "src/types";

const validate = (values: IProfile): FormikErrors<IProfile> => {
  const errors: FormikErrors<IProfile> = {};

  if (!values.name || values.name.trim().length === 0) {
    errors.name = GetMessage("profile_validation_missingName");
  }

  if (!values.urlMatch || values.urlMatch.trim().length === 0) {
    errors.urlMatch = GetMessage("profile_validation_missingUrlMatch");
  } else {
    const expression = values.urlMatch.trim();
    try {
      if (!new RegExp(expression)) {
        errors.urlMatch = "Please enter a valid regular expression.";
      }
    } catch (e) {
      errors.urlMatch = "Please enter a valid regular expression.";
    }
  }

  return errors;
};

type Props = {
  profile?: IProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: IProfile) => void;
};

const ProfileModal = (props: Props) => {
  const initialValues: IProfile = {
    name: props.profile ? props.profile.name : "",
    urlMatch: props.profile ? props.profile.urlMatch : "",
    fields: [],
  };

  return (
    <Modal size="lg" show={props.isOpen} onHide={props.onClose}>
      <Formik initialValues={initialValues} validate={validate} onSubmit={props.onSave}>
        {({ isSubmitting, isValid }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>{GetMessage("profile_modal_title")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TextField name="name" label={GetMessage("profile_label_name")} />
              <TextField
                name="urlMatch"
                label={GetMessage("profile_label_urlMatch")}
                helpText={GetMessage("profile_label_urlMatch_helpText")}
              />
            </Modal.Body>
            <Modal.Footer>
              <button type="button" className="btn btn-outline-secondary" onClick={props.onClose}>
                {GetMessage("Cancel")}
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
                {GetMessage("Save")}
              </button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

ProfileModal.defaultProps = {
  profile: undefined,
};

export default ProfileModal;
