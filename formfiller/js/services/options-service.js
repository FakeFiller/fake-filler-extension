app.factory('OptionsService', function () {
    var factoryMethods = {};
    var options = null;

    function getDefaultOptions() {
        return FormFillerDefaultOptions();
    }

    factoryMethods.getFieldTypes = function () {
        var types = [];

        types.push({
            group: 'Human Data',
            id: 'first-name',
            name: 'First Name'
        });
        types.push({
            group: 'Human Data',
            id: 'last-name',
            name: 'Last Name'
        });
        types.push({
            group: 'Human Data',
            id: 'full-name',
            name: 'Full Name'
        });
        types.push({
            group: 'Human Data',
            id: 'username',
            name: 'Username'
        });
        types.push({
            group: 'Human Data',
            id: 'email',
            name: 'Email Address'
        });
        types.push({
            group: 'Human Data',
            id: 'organization',
            name: 'Organization/Company Name'
        });
        types.push({
            group: 'Human Data',
            id: 'telephone',
            name: 'Telephone Number'
        });
        types.push({
            group: 'Human Data',
            id: 'number',
            name: 'Number'
        });
        types.push({
            group: 'Human Data',
            id: 'date',
            name: 'Date'
        });
        types.push({
            group: 'Human Data',
            id: 'url',
            name: 'URL/Website Address'
        });

        types.push({
            group: 'Other',
            id: 'text',
            name: 'Text'
        });
        types.push({
            group: 'Other',
            id: 'alphanumeric',
            name: 'Alphanumeric'
        });
        types.push({
            group: 'Other',
            id: 'regex',
            name: 'Regular Expression'
        });
        types.push({
            group: 'Other',
            id: 'randomized-list',
            name: 'Randomized List'
        });

        return types;
    };

    factoryMethods.saveOptions = function () {
        SaveFormFillerOptions(options);
        CreateContextMenus();
    };

    factoryMethods.saveImportedOptions = function (importedOptions) {
        options = importedOptions;
        factoryMethods.saveOptions();
    };

    factoryMethods.resetToFactorySettings = function () {
        options = getDefaultOptions();
        factoryMethods.saveOptions();
    };

    factoryMethods.getOptions = function () {
        options = GetFormFillerOptions();
        return options;
    };

    factoryMethods.addCustomField = function (field) {
        options.fields.push(field);
        factoryMethods.saveOptions();
    };

    factoryMethods.saveCustomField = function (field, index) {
        if (index < 0) {
            options.fields.push(field);
        } else {
            options.fields[index] = field;
        }

        factoryMethods.saveOptions();
    };

    factoryMethods.deleteCustomField = function (index) {
        options.fields.splice(index, 1);
        factoryMethods.saveOptions();
    };

    factoryMethods.convertCsvToArray = function (csvString) {
        var splitValues = csvString && csvString.length > 0 ? csvString.split(',') : [],
            arrayData = [],
            i = 0;

        for (; i < splitValues.length; i++) {
            splitValues[i] = splitValues[i].replace(/^\s*/, '').replace(/\s*$/, '');
            if (splitValues[i].length > 0) {
                arrayData.push(splitValues[i]);
            }
        }

        return arrayData;
    };

    factoryMethods.convertMultipleLinesToArray = function (delimitedString) {
        var splitValues = delimitedString && delimitedString.length > 0 ? delimitedString.split('\n') : [],
            arrayData = [],
            i = 0;

        for (; i < splitValues.length; i++) {
            splitValues[i] = splitValues[i].replace(/^\s*/, '').replace(/\s*$/, '');
            if (splitValues[i].length > 0) {
                arrayData.push(splitValues[i]);
            }
        }

        return arrayData;
    };

    return factoryMethods;
});