'use strict';

var app = angular.module('FormFiller', ['ngRoute', 'ngMessages', 'ui.bootstrap', 'ui.sortable']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', { templateUrl: '../partials/general.html', controller: 'GeneralOptionsController'});
    $routeProvider.when('/custom-fields', { templateUrl: '../partials/custom-fields.html', controller: 'CustomFieldsController'});
    $routeProvider.when('/backup', { templateUrl: '../partials/backup.html', controller: 'BackupAndRestoreController'});
    $routeProvider.when('/changelog', { templateUrl: '../partials/changelog.html', controller: 'ChangeLogController'});
    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.filter('toCsv', function () {
    return function (input) {
        if (angular.isArray(input)) {
            return input.join(', ');
        }
        else {
            return input;
        }
    };
});

app.directive('fileOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            var onChangeFunction = element.scope()[attributes.fileOnChange];
            element.bind('change', onChangeFunction);
        }
    }
});

app.directive('lessThanOrEqualTo', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, controller) {
            var validate = function (viewValue) {
                var comparisonModel = attributes.lessThanOrEqualTo;

                if (!viewValue || !comparisonModel) {
                    controller.$setValidity('lessThanOrEqualTo', true);
                }

                controller.$setValidity('lessThanOrEqualTo', parseInt(viewValue, 10) <= parseInt(comparisonModel, 10));
                return viewValue;
            };

            controller.$parsers.unshift(validate);
            controller.$parsers.push(validate);

            attributes.$observe('lessThanOrEqualTo', function (comparisonModel) {
                return validate(controller.$viewValue);
            });
        }
    }
});
