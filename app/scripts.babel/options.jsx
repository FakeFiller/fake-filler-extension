import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';

import Store from './options/store';

import App from './options/components/App';
import GeneralSettingsPage from './options/components/GeneralSettingsPage';
import CustomFieldsPage from './options/components/CustomFieldsPage';
import KeyboardShortcutsPage from './options/components/KeyboardShortcutsPage';
import BackupAndRestorePage from './options/components/BackupAndRestorePage';
import ChangelogPage from './options/components/ChangelogPage';

ReactDOM.render((
  <Provider store={Store}>
    <Router history={hashHistory}>
      <Route component={App}>
        <IndexRoute component={GeneralSettingsPage} />
        <Route path="/" component={GeneralSettingsPage} />
        <Route path="custom-fields" component={CustomFieldsPage} />
        <Route path="keyboard-shortcuts" component={KeyboardShortcutsPage} />
        <Route path="backup" component={BackupAndRestorePage} />
        <Route path="changelog" component={ChangelogPage} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));
