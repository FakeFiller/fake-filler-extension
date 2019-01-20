import { Field, Form, Formik, FormikActions, FormikErrors } from 'formik';
import * as React from 'react';

import { GetMessage, SaveKeyboardShortcuts } from '../../../common/helpers';

interface IFormCommandValue {
  name: BrowserCommandName;
  modifier1?: string;
  modifier2?: string;
  key?: string;
}

interface IFormValues {
  commands: IFormCommandValue[];
}

function range(start: number, end: number): number[] {
  return [...Array(1 + end - start).keys()].map(v => start + v);
}

function hasDuplicates(array: string[]): boolean {
  return array.filter((item, index) => array.indexOf(item) !== index).length > 0;
}

const validate = (values: IFormValues): FormikErrors<IFormValues> => {
  const errors: FormikErrors<IFormValues> = {
    commands: [],
  };

  const shortcuts: string[] = [];

  values.commands.forEach((command, index) => {
    if (command.modifier1 || command.modifier2 || command.key) {
      if (command.modifier1 === command.modifier2 && errors.commands) {
        errors.commands[index] = 'Required';
      }
      if (!command.key && errors.commands) {
        errors.commands[index] = 'Required';
      }
      shortcuts.push(`${command.modifier1}${command.modifier2}${command.key}`);
    }
  });

  if (hasDuplicates(shortcuts) && errors.commands) {
    errors.commands.push('Duplicates');
  }

  if (errors.commands && errors.commands.length === 0) {
    return {};
  }

  return errors;
};

interface IOwnProps {
  keyboardShortcuts: chrome.commands.Command[];
}

interface IState {
  theShortcut: string[];
  showSavedMessage: boolean;
}

class FirefoxKeyboardShortcuts extends React.PureComponent<IOwnProps, IState> {
  constructor(props: IOwnProps) {
    super(props);

    this.state = {
      theShortcut: [],
      showSavedMessage: false,
    };

    this.getTranslatedDescription = this.getTranslatedDescription.bind(this);
    this.getGetModifiedField = this.getGetModifiedField.bind(this);
    this.getKeyField = this.getKeyField.bind(this);
    this.getShortcutFields = this.getShortcutFields.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private getTranslatedDescription(key: string): string {
    if (key.startsWith('__MSG_')) {
      return GetMessage(key.replace('__MSG_', '').replace('__', ''));
    }
    return key;
  }

  private getGetModifiedField(name: string): JSX.Element {
    return (
      <Field component="select" name={name}>
        <option value="Ctrl">Ctrl</option>
        <option value="Alt">Alt</option>
        <option value="Shift">Shift</option>
      </Field>
    );
  }

  private getKeyField(name: string): JSX.Element {
    return (
      <Field component="select" name={name}>
        {range(48, 57).map(v => (
          <option key={v} value={String.fromCharCode(v)}>
            {String.fromCharCode(v)}
          </option>
        ))}
        {range(65, 90).map(v => (
          <option key={v} value={String.fromCharCode(v)}>
            {String.fromCharCode(v)}
          </option>
        ))}
        <option value="Period">.</option>
        <option value="Comma">,</option>
        {['Home', 'End', 'PageUp', 'PageDown', 'Space', 'Insert', 'Delete', 'Up', 'Down', 'Left', 'Right'].map(v => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </Field>
    );
  }

  private getShortcutFields(command: chrome.commands.Command, index: number): JSX.Element {
    if (command.name) {
      return (
        <>
          <input type="hidden" name={`commands[${index}].name`} value={command.name} />
          {this.getGetModifiedField(`commands[${index}].modifier1`)}
          {this.getGetModifiedField(`commands[${index}].modifier2`)}
          {this.getKeyField(`commands[${index}].key`)}
        </>
      );
    }

    return <div />;
  }

  private handleSubmit(values: IFormValues, actions: FormikActions<IFormValues>): void {
    const commands: IFormFillerBrowserCommand[] = [];

    values.commands.forEach(item => {
      const commandParts: string[] = [];

      if (item.modifier1) {
        commandParts.push(item.modifier1);
      }

      if (item.modifier2) {
        commandParts.push(item.modifier2);
      }

      if (item.key) {
        commandParts.push(item.key);
      }

      commands.push({
        name: item.name,
        shortcut: commandParts.join('+'),
      });
    });

    SaveKeyboardShortcuts(commands);
    actions.setSubmitting(false);

    this.setState({
      showSavedMessage: true,
    });
  }

  public render(): JSX.Element {
    const initialValues: IFormValues = {
      commands: [],
    };

    this.props.keyboardShortcuts.map(item => {
      if (item.name && item.shortcut) {
        const shortcutParts = item.shortcut.split('+');

        if (shortcutParts.length === 2) {
          initialValues.commands.push({
            name: item.name as BrowserCommandName,
            modifier1: shortcutParts[0],
            modifier2: '',
            key: shortcutParts[1],
          });
        } else if (shortcutParts.length === 3) {
          initialValues.commands.push({
            name: item.name as BrowserCommandName,
            modifier1: shortcutParts[0],
            modifier2: shortcutParts[1],
            key: shortcutParts[2],
          });
        }
      }
    });

    return (
      <Formik initialValues={initialValues} validate={validate} onSubmit={this.handleSubmit}>
        {({ isSubmitting, isValid }) => (
          <Form>
            <h2>{GetMessage('kbdShortcuts_title')}</h2>
            <table className="table table-borderless table-sm">
              <tbody>
                {this.props.keyboardShortcuts.map((item, index) => {
                  if (item.description) {
                    return (
                      <tr key={index}>
                        <td className="narrow">{this.getShortcutFields(item, index)}</td>
                        <td>{this.getTranslatedDescription(item.description)}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <button className="btn btn-sm btn-primary" disabled={isSubmitting || !isValid}>
              {GetMessage('save')}
            </button>
            {this.state.showSavedMessage && (
              <span className="saved-msg">{GetMessage('generalSettings_settingsSaved')}</span>
            )}
          </Form>
        )}
      </Formik>
    );
  }
}

export default FirefoxKeyboardShortcuts;
