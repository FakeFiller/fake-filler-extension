app.controller('CustomFieldsController', ['$scope', '$modal', 'OptionsService', function ($scope, $modal, OptionsService) {
    $scope.options = OptionsService.getOptions();

    $scope.sortableOptions = {
        handle: '.sort-handle',
        axis: 'y',
        stop: function () {
            OptionsService.saveOptions();
        }
    };

    $scope.editField = function (field, index) {
        $scope.fieldCopy = angular.copy(field);

        var modalInstance = $modal.open({
            templateUrl: 'editCustomFieldModal.html',
            controller: EditCustomFieldController,
            resolve: {
                field: function () {
                    return field;
                }
            }
        });

        modalInstance.result.then(function (updatedField) {
            OptionsService.saveCustomField(updatedField, index);
        }, function () {
            field = $scope.fieldCopy;
        });
    };

    $scope.deleteField = function (index) {
        if (confirm('Are you sure you want to delete this custom field?')) {
            OptionsService.deleteCustomField(index);
        }
    };
}]);

var EditCustomFieldController = function ($scope, $modalInstance, $filter, OptionsService, field) {
    $scope.field = angular.copy(field);
    $scope.field.match = $filter('toCsv')($scope.field.match);
    $scope.field.list = $scope.field.list ? $scope.field.list.join('\n') : '';
    $scope.types = OptionsService.getFieldTypes();
    $scope.sampleRegularExpressionData = null;

    var originalField = angular.copy(field) || {};

    $scope.$watch('field.type', function (newValue) {
        if (newValue == 'telephone') {
            $scope.field.template = originalField.type == 'telephone'
                ? originalField.template || '+XXX-Xx-Xxxxxxx'
                : '+XXX-Xx-Xxxxxxx';
        }

        if (newValue == 'date') {
            $scope.field.template = originalField.type == 'date'
                ? originalField.template || 'DD-MMM-YYYY'
                : 'DD-MMM-YYYY';
        }

        if (newValue == 'number') {
            $scope.field.min = originalField.type == 'number'
                ? originalField.min || 0
                : 0;

            $scope.field.max = originalField.type == 'number'
                ? originalField.max || 99999
                : 99999;
        }

        if (newValue == 'text') {
            $scope.field.min = originalField.type == 'text'
                ? originalField.min || 1
                : 1;

            $scope.field.max = originalField.type == 'text'
                ? originalField.max || 20
                : 20;
        }

        if (newValue == 'alphanumeric') {
            $scope.field.template = originalField.type == 'alphanumeric'
                ? originalField.template || ''
                : '';
        }

        if (newValue == 'regex') {
            $scope.field.template = originalField.type == 'regex'
                ? originalField.template || ''
                : '';
        }
    });

    $scope.testRegExPattern = function () {
        try {
            $scope.sampleRegularExpressionData = new RandExp($scope.field.template, $scope.field.caseInSensitive ? 'i' : '').gen();
        }
        catch (e) {
            $scope.sampleRegularExpressionData = e.toString();
        }
    };

    $scope.ok = function () {
        $scope.field.match = OptionsService.convertCsvToArray($scope.field.match);
        var listData = OptionsService.convertMultipleLinesToArray($scope.field.list);

        if (listData.length > 0) {
            $scope.field.list = listData;
        }
        else {
            delete $scope.field.list;
        }

        $modalInstance.close($scope.field);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
EditCustomFieldController.$inject = ['$scope', '$modalInstance', '$filter', 'OptionsService', 'field'];
