// Generate a random date between two dates - http://jay-notes.blogspot.com/2010/06/how-to-generate-random-date-between-two.html

$(function() {
    var app = null;

    var navGeneral = $('#nav-general'),
        navFields = $('#nav-fields'),
        tabGeneral = $('#tab-general'),
        tabFields = $('#tab-fields'),
        factoryReset = $('#factory-reset'),
        savedMessage = $('.saved-msg'),
        emailSettingsArea = $('#email-settings-area'),
        passwordSettingsArea = $('#password-settings-area'),
        otherFieldsArea = $('#other-fields-area'),
        saveGeneralSettingsButton = $('#save-general-settings'),
        addFieldButton = $('#add-field'),
        createFieldButton = $('#create-field'),
        fieldSettingsModal = $('#field-settings-modal'),
        fieldOptionsArea = $('#field-options-area'),
        fieldsListView = $('#fields-list-view'),
        inputFieldType = $('#if-type'),
        inputFieldName = $('#if-name'),
        inputFieldMatch = $('#if-match'),
        inputFieldIndex = $('#if-index');

    var templateEmailEditor = $('#template-email-editor').html(),
        templatePasswordEditor = $('#template-password-editor').html(),
        templateOtherFieldsEditor = $('#template-other-fields-editor').html();

    var templateNumberEditor = $('#template-number-editor').html(),
        templateTelephoneEditor = $('#template-telephone-editor').html(),
        templateDateEditor = $('#template-date-editor').html(),
        templateAlphanumericEditor = $('#template-alphanumeric-editor').html(),
        templateTextEditor = $('#template-text-editor').html();

    var templateDefaultView = $('#template-default-view').html(),
        templateTelephoneView = $('#template-telephone-view').html(),
        templateNumberView = $('#template-number-view').html(),
        templateDateView = $('#template-date-view').html(),
        templateAlphanumericView = $('#template-alphanumeric-view').html(),
        templateTextView = $('#template-text-view').html();

    chrome.runtime.getBackgroundPage(function(page) {
        app = page.application;
        loadGeneralView();
        loadCustomFieldsView();
    });

    factoryReset.on('click', function(e) {
        e.preventDefault();
        app.restoreFactorySettings();
        loadGeneralView();
        loadCustomFieldsView();
    });

    saveGeneralSettingsButton.on('click', function(e) {
        e.preventDefault();
        var emailOptions = getEmailOptionsFromForm();
        var passwordOptions = getPasswordOptionsFromForm();
        var ignoreFieldsOptions = getIgnoreFieldOptionsFromForm();
        var confirmFieldsOptions = getConfirmFieldOptionsFromForm();

        if (emailOptions.hasErrors == false
            && passwordOptions.hasErrors == false
            && ignoreFieldsOptions.hasErrors == false
            && confirmFieldsOptions.hasErrors == false
            ) {
            var options = app.getOptions();
            delete(emailOptions.hasErrors);
            delete(passwordOptions.hasErrors);
            options.emailSettings = emailOptions;
            options.passwordSettings = passwordOptions;
            options.triggerClickEvents = ignoreFieldsOptions.triggerClickEvents;
            options.ignoreHiddenFields = ignoreFieldsOptions.ignoreHiddenFields;
            options.ignoredFields = ignoreFieldsOptions.ignoredFields;
            options.confirmFields = confirmFieldsOptions.confirmFields;
            app.setOptions(options);
            savedMessage.show();
            loadGeneralView();
        }
    });

    navFields.on('click', function(e) {
        e.preventDefault();
        savedMessage.hide();
        navFields.addClass('active');
        navGeneral.removeClass('active');
        tabFields.show();
        tabGeneral.hide();
    });

    navGeneral.on('click', function(e) {
        e.preventDefault();
        savedMessage.hide();
        navFields.removeClass('active');
        navGeneral.addClass('active');
        tabFields.hide();
        tabGeneral.show();
    });

    addFieldButton.on('click', function(e) {
        e.preventDefault();
        inputFieldIndex.val('-1');
        inputFieldType.val('');
        inputFieldType.closest('div.control-group').removeClass('error');
        inputFieldName.val('');
        inputFieldName.closest('div.control-group').removeClass('error');
        inputFieldMatch.val('');
        inputFieldMatch.closest('div.control-group').removeClass('error');
        fieldOptionsArea.html('');
        fieldSettingsModal.modal('show');
        inputFieldType.focus();
    });

    inputFieldType.on('change', function() {
        if (this.value.length == 0) {
            inputFieldName.val('');
            inputFieldMatch.val('');
        }

        loadEditorTemplateByType(this.value);
    });

    createFieldButton.on('click', function(e) {
        e.preventDefault();
        var fieldType = inputFieldType.val();
        if (fieldType.length == 0) {
            getDefaultOptionsFromForm();
            return;
        }

        var options;

        switch (fieldType) {
            case 'number':
                options = getNumberOptionsFromForm();
                break;

            case 'telephone':
                options = getTelephoneOptionsFromForm();
                break;

            case 'date':
                options = getDateOptionsFromForm();
                break;

            case 'alphanumeric':
                options = getAlphanumericOptionsFromForm();
                break;

            case 'text':
                options = getTextOptionsFromForm();
                break;

            default:
                // first-name
                // last-name
                // full-name
                // username
                // password
                // email
                // organization
                options = getDefaultOptionsFromForm();
                break;
        }

        if (options.hasErrors === false) {
            if (inputFieldIndex.val() > -1) {
                app.saveCustomField(options, inputFieldIndex.val());
            }
            else {
                app.addCustomField(options);
            }
            loadCustomFieldsView();
            fieldSettingsModal.modal('hide');
        }
    });

    fieldsListView.on('click', '.field-move-up', function(e) {
        e.preventDefault();
        app.moveCustomFieldUp($(this).data('index'));
        loadCustomFieldsView();
    });

    fieldsListView.on('click', '.field-move-down', function(e) {
        e.preventDefault();
        app.moveCustomFieldDown($(this).data('index'));
        loadCustomFieldsView();
    });

    fieldsListView.on('click', '.field-edit', function(e) {
        e.preventDefault();
        var field = app.getOptions().fields[$(this).data('index')];
        inputFieldType.val(field.type);
        inputFieldName.val(field.name);
        inputFieldMatch.val(field.match.join(', '));
        inputFieldIndex.val($(this).data('index'));
        loadEditorTemplateByType(field.type, field);
        fieldSettingsModal.modal('show');
    });

    fieldsListView.on('click', '.field-delete', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this custom field?')) {
            app.removeCustomField($(this).data('index'));
            loadCustomFieldsView();
        }
    });

    function loadEditorTemplateByType(type, options) {
        switch (type) {
            case 'number':
                options = options || getNumberOptionsDefaults();
                fieldOptionsArea.html(Mustache.to_html(templateNumberEditor, options));
                break;

            case 'telephone':
                options = options || getTelephoneOptionsDefaults();
                fieldOptionsArea.html(Mustache.to_html(templateTelephoneEditor, options));
                break;

            case 'date':
                options = options || getDateOptionsDefaults();
                fieldOptionsArea.html(Mustache.to_html(templateDateEditor, options));
                break;

            case 'alphanumeric':
                options = options || getAlphanumericOptionsDefaults();
                fieldOptionsArea.html(Mustache.to_html(templateAlphanumericEditor, options));
                break;

            case 'text':
                options = options || getTextOptionsDefaults();
                fieldOptionsArea.html(Mustache.to_html(templateTextEditor, options));
                break;

            default:
                fieldOptionsArea.html('');
                break;
        }
    }

    function loadGeneralView() {
        var options = app.getOptions(),
            emailOptions = options.emailSettings;

        emailOptions.wrappedUsername = function() {
            return function(text) {
                return text.replace('value="' + this.username + '"', 'value="' + this.username + '" checked');
            };
        };
        emailOptions.wrappedHostname = function() {
            return function(text) {
                return text.replace('value="' + this.hostname + '"', 'value="' + this.hostname + '" checked');
            }
        };
        emailOptions.usernameListFormatted = function() {
            return this.usernameList.join(', ');
        };
        emailOptions.hostnameListFormatted = function() {
            return this.hostnameList.join(', ');
        };

        emailSettingsArea.html(Mustache.to_html(templateEmailEditor, emailOptions));

        var passwordOptions = options.passwordSettings;
        passwordOptions.notRandom = passwordOptions.random == false;
        passwordSettingsArea.html(Mustache.to_html(templatePasswordEditor, passwordOptions));

        var otherOptions = {};
        otherOptions.triggerClickEvents = options.triggerClickEvents;
        otherOptions.ignoreHiddenFields = options.ignoreHiddenFields;
        otherOptions.ignoredFields = options.ignoredFields;
        otherOptions.ignoredFieldsFormatted = function() {
            return this.ignoredFields.join(', ');
        };
        otherOptions.confirmFields = options.confirmFields;
        otherOptions.confirmFieldsFormatted = function() {
            return this.confirmFields.join(', ');
        };
        otherFieldsArea.html(Mustache.to_html(templateOtherFieldsEditor, otherOptions));
    }

    function loadCustomFieldsView() {
        var fields = app.getOptions().fields,
            field = {},
            i = 0,
            count = fields.length;

        fieldsListView.html('');

        for (; i < count; i++) {
            field = fields[i];
            field.index = i;
            field.matchFormatted = function() {
                return this.match.join(', ');
            };

            switch (field.type) {
                case 'number':
                    fieldsListView.append(Mustache.to_html(templateNumberView, field));
                    break;

                case 'telephone':
                    fieldsListView.append(Mustache.to_html(templateTelephoneView, field));
                    break;

                case 'date':
                    fieldsListView.append(Mustache.to_html(templateDateView, field));
                    break;

                case 'alphanumeric':
                    fieldsListView.append(Mustache.to_html(templateAlphanumericView, field));
                    break;

                case 'text':
                    fieldsListView.append(Mustache.to_html(templateTextView, field));
                    break;

                case 'first-name':
                case 'last-name':
                case 'full-name':
                case 'username':
                case 'email':
                case 'organization':
                case 'url':
                    fieldsListView.append(Mustache.to_html(templateDefaultView, field));
                    break;

                default:
                    alert('unknown field type: ' + field.type);
                    break;
            }
        }
    }

    function getDefaultOptionsFromForm(options) {
        options = options || {};

        options.hasErrors = false;
        options.type = inputFieldType.val();
        options.name = inputFieldName.val().trim();
        options.match = csvToArray(inputFieldMatch.val().trim());

        if (options.type.length == 0) {
            inputFieldType.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputFieldType.closest('div.control-group').removeClass('error');
        }

        if (options.name.length == 0) {
            inputFieldName.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputFieldName.closest('div.control-group').removeClass('error');
        }

        if (options.match.length == 0) {
            inputFieldMatch.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputFieldMatch.closest('div.control-group').removeClass('error');
        }

        return options;
    }

    function getEmailOptionsFromForm() {
        var options = {},
            usernameList = $('#if-email-username-list'),
            hostnameList = $('#if-email-hostname-list');

        options.hasErrors = false;
        options.username = $('input[type="radio"]:checked', '#email-username-area').val();
        options.hostname = $('input[type="radio"]:checked', '#email-hostname-area').val();
        options.usernameList = csvToArray(usernameList.val());
        options.hostnameList = csvToArray(hostnameList.val());

        if (options.username == 'list' && options.usernameList.length == 0) {
            options.hasErrors = true;
            usernameList.closest('div.control-group').addClass('error');
        }
        else {
            usernameList.closest('div.control-group').removeClass('error');
        }

        if (options.hostname == 'list' && options.hostnameList.length == 0) {
            options.hasErrors = true;
            hostnameList.closest('div.control-group').addClass('error');
        } else {
            hostnameList.closest('div.control-group').removeClass('error');
        }

        return options;
    }

    function getPasswordOptionsFromForm() {
        var options = {},
            passwordRandom = $('#if-password-random');

        options.hasErrors = false;
        options.random = passwordRandom.is(':checked');
        options.password = $('#if-password').val();

        if (options.random == false && options.password.length == 0) {
            passwordRandom.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            passwordRandom.closest('div.control-group').removeClass('error');
        }

        return options;
    }

    function getIgnoreFieldOptionsFromForm() {
        var options = {},
            match = $('#if-ignore-match'),
            ignoreHidden = $('#if-ignore-hidden'),
            triggerClickEvent = $('#if-trigger-click-event');

        options.hasErrors = false;
        options.ignoredFields = csvToArray(match.val());
        options.ignoreHiddenFields = ignoreHidden.is(':checked');
        options.triggerClickEvents = triggerClickEvent.is(':checked');

        return options;
    }

    function getConfirmFieldOptionsFromForm() {
        var options = {},
            match = $('#if-confirm-match');

        options.hasErrors = false;
        options.confirmFields = csvToArray(match.val());

        return options;
    }

    function getNumberOptionsFromForm() {
        var options = getDefaultOptionsFromForm(),
            inputMin = $('#if-number-min'),
            inputMax = $('#if-number-max');

        options.min = inputMin.val();
        options.max = inputMax.val();

        if (!isInteger(options.min)) {
            inputMin.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputMin.closest('div.control-group').removeClass('error');
            options.min = parseInt(options.min);
        }

        if (!isInteger(options.max)) {
            inputMax.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputMax.closest('div.control-group').removeClass('error');
            options.max = parseInt(options.max);
        }

        if (options.hasErrors == false && options.min >= options.max) {
            options.hasErrors = true;
            inputMin.closest('div.control-group').addClass('error');
            inputMax.closest('div.control-group').addClass('error');
        }

        return options;
    }

    function getNumberOptionsDefaults() {
        var options = {};
        options.min = 0;
        options.max = 99999;
        return options;
    }

    function getTextOptionsFromForm() {
        var options = getDefaultOptionsFromForm(),
            inputMin = $('#if-text-min'),
            inputMax = $('#if-text-max');

        options.min = inputMin.val();
        options.max = inputMax.val();

        if (!isInteger(options.min)) {
            inputMin.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputMin.closest('div.control-group').removeClass('error');
            options.min = parseInt(options.min);
        }

        if (!isInteger(options.max)) {
            inputMax.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            inputMax.closest('div.control-group').removeClass('error');
            options.max = parseInt(options.max);
        }

        if (options.hasErrors == false && options.min >= options.max) {
            options.hasErrors = true;
            inputMin.closest('div.control-group').addClass('error');
            inputMax.closest('div.control-group').addClass('error');
        }

        return options;
    }

    function getTextOptionsDefaults() {
        var options = {};
        options.min = 1;
        options.max = 20;
        return options;
    }

    function getTelephoneOptionsFromForm() {
        var options = getDefaultOptionsFromForm(),
            template = $('#if-telephone-template');

        options.template = template.val();

        if (options.template.length == 0) {
            template.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            template.closest('div.control-group').removeClass('error');
        }

        return options;
    }

    function getTelephoneOptionsDefaults() {
        var options = {};
        options.template = '+XXX-Xx-Xxxxxxx';
        return options;
    }

    function getAlphanumericOptionsFromForm() {
        var options = getDefaultOptionsFromForm(),
            template = $('#if-alphanumeric-template');

        options.template = template.val();

        if (options.template.length == 0) {
            template.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            template.closest('div.control-group').removeClass('error');
        }

        return options;
    }

    function getAlphanumericOptionsDefaults() {
        return {};
    }

    function getDateOptionsFromForm() {
        var options = getDefaultOptionsFromForm(),
            template = $('#if-date-template');

        options.template = template.val();

        if (options.template.length == 0) {
            template.closest('div.control-group').addClass('error');
            options.hasErrors = true;
        }
        else {
            template.closest('div.control-group').removeClass('error');
        }

        return options;
    }

    function getDateOptionsDefaults() {
        var options = {};
        options.template = 'dd-mmm-yyyy';
        return options;
    }

    function isInteger(value) {
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    }

    function csvToArray(values) {
        var splitValues = values.split(','),
            data = [];
        for (var i = 0; i < splitValues.length; i++) {
            splitValues[i] = splitValues[i].replace(/^\s*/, '').replace(/\s*$/, '');
            if (splitValues[i].length > 0) {
                data.push(splitValues[i]);
            }
        }
        return data;
    }
});