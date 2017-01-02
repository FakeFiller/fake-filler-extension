import { PropTypes } from 'react';

const shapeOfCustomField = PropTypes.shape({
  match: PropTypes.arrayOf(PropTypes.string),
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  template: PropTypes.string,
  type: PropTypes.oneOf([
    'alphanumeric',
    'date',
    'email',
    'first-name',
    'full-name',
    'last-name',
    'number',
    'organization',
    'randomized-list',
    'regex',
    'telephone',
    'text',
    'url',
    'username',
  ]),
});

const shapeOfOptions = PropTypes.shape({
  agreeTermsFields: PropTypes.arrayOf(PropTypes.string),
  confirmFields: PropTypes.arrayOf(PropTypes.string),
  emailSettings: PropTypes.shape({
    hostname: PropTypes.oneOf(['list', 'random']),
    hostnameList: PropTypes.arrayOf(PropTypes.string),
    username: PropTypes.oneOf(['list', 'name', 'random', 'username', 'regex']),
    usernameList: PropTypes.arrayOf(PropTypes.string),
  }),
  enableContextMenu: PropTypes.bool,
  fieldMatchSettings: PropTypes.shape({
    matchClass: PropTypes.bool,
    matchId: PropTypes.bool,
    matchLabel: PropTypes.bool,
    matchName: PropTypes.bool,
  }),
  fields: PropTypes.arrayOf(shapeOfCustomField),
  ignoreFieldsWithContent: PropTypes.bool,
  ignoreHiddenFields: PropTypes.bool,
  ignoredFields: PropTypes.arrayOf(PropTypes.string),
  passwordSettings: PropTypes.shape({
    mode: PropTypes.oneOf(['defined', 'random']),
    password: PropTypes.string,
  }),
  triggerClickEvents: PropTypes.bool,
});

export { shapeOfCustomField, shapeOfOptions };
