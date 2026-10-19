import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, NavLink, Route, Routes } from "react-router";

import { GetMessage, FakeFillerDefaultOptions } from "src/common/helpers";
import { saveOptions, MyThunkDispatch } from "src/options/actions";
import AiFillPage from "src/options/components/AiFillPage";
import BackupAndRestorePage from "src/options/components/BackupAndRestorePage";
import ChangeLogPage from "src/options/components/ChangeLogPage";
import CustomFieldsPage from "src/options/components/CustomFieldsPage";
import GeneralSettingsPage from "src/options/components/GeneralSettingsPage";
import KeyboardShortcutsPage from "src/options/components/KeyboardShortcutsPage";
import ExternalLink from "src/options/components/common/ExternalLink";
import ScrollToTop from "src/options/components/common/ScrollToTop";

import "src/options/components/App.scss";

function App() {
  const dispatch = useDispatch<MyThunkDispatch>();

  function handleResetSettings(event: React.SyntheticEvent): void {
    event.preventDefault();

    if (window.confirm(GetMessage("leftNav_confirmResetSettings"))) {
      const options = FakeFillerDefaultOptions();
      dispatch(saveOptions(options));
    }
  }

  return (
    <>
      <ScrollToTop />
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>
          <img src="images/logo-white.svg" height="30" alt={GetMessage("extensionName")} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              {GetMessage("leftNav_General")}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/custom-fields">
              {GetMessage("leftNav_customFields")}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/keyboard-shortcuts">
              {GetMessage("leftNav_keyboardShortcuts")}
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ai-fill">
              AI Fill
            </Nav.Link>
            <Nav.Link as={NavLink} to="/backup">
              {GetMessage("leftNav_backupRestore")}
            </Nav.Link>
            <Nav.Link href="https://github.com/FakeFiller/fake-filler-extension/wiki" target="_blank">
              Help
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div id="main-content" className="container">
        <Routes>
          <Route path="/" element={<GeneralSettingsPage />} />
          <Route path="/custom-fields/:index?" element={<CustomFieldsPage />} />
          <Route path="/keyboard-shortcuts" element={<KeyboardShortcutsPage />} />
          <Route path="/ai-fill" element={<AiFillPage />} />
          <Route path="/backup" element={<BackupAndRestorePage />} />
          <Route path="/changelog" element={<ChangeLogPage />} />
        </Routes>
      </div>
      <footer id="main-footer" className="container">
        <ul className="list-inline">
          <li className="list-inline-item">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" onClick={handleResetSettings}>
              {GetMessage("leftNav_restoreFactorySettings")}
            </a>
          </li>
          <li className="list-inline-item">
            <Link to="/changelog">{GetMessage("leftNav_changelog")}</Link>
          </li>
        </ul>
        <p className="text-muted small mt-2">
          Built and maintained by <ExternalLink url="https://averbee.com/">Averbee</ExternalLink>.
          <br />
          Based on <ExternalLink url="https://github.com/FakeFiller/fake-filler-extension">Fake Filler</ExternalLink> by
          Hussein Shabbir, used under the MIT licence.
        </p>
      </footer>
    </>
  );
}

export default App;
