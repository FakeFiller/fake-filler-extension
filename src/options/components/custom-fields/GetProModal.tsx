import React from "react";
import { Modal } from "react-bootstrap";

import { GetMessage } from "src/common/helpers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const GetProModal = (props: Props) => {
  return (
    <Modal show={props.isOpen} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{GetMessage("upgradeToFakeFillerPro")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You need to upgrade to Fake Filler Pro to create more than 25 custom fields.</p>

        <div className="alert alert-info">
          <p>By upgrading to Fake Filler Pro, you unlock these amazing features:</p>
          <ul>
            <li>
              Create <b>UNLIMITED</b> custom fields.
            </li>
            <li>Sync your settings across all you browsers</li>
            <li>Create URL-specific custom fields (multiple profiles)</li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <a className="btn btn-primary" href="https://fakefiller.com/#pricing">
          {GetMessage("upgradeToFakeFillerPro")}
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default GetProModal;
