app.controller('GeneralOptionsController', ['$scope', '$filter', '$timeout', 'OptionsService', function ($scope, $filter, $timeout, OptionsService) {
    $scope.messages = { success: false };
    $scope.canChangeKeyboardShortcuts = true;

    OptionsService.getOptions().then(function (options) {
        $scope.options = options;

        $scope.ignoredFieldsCsv = $filter('toCsv')($scope.options.ignoredFields);
        $scope.confirmFieldsCsv = $filter('toCsv')($scope.options.confirmFields);
        $scope.agreeTermsFieldsCsv = $filter('toCsv')($scope.options.agreeTermsFields);
        $scope.emailUsernameListCsv = $filter('toCsv')($scope.options.emailSettings.usernameList);
        $scope.emailHostnameListCsv = $filter('toCsv')($scope.options.emailSettings.hostnameList);

        $scope.saveOptions = function () {
            $scope.options.ignoredFields = OptionsService.convertCsvToArray($scope.ignoredFieldsCsv);
            $scope.options.confirmFields = OptionsService.convertCsvToArray($scope.confirmFieldsCsv);
            $scope.options.agreeTermsFields = OptionsService.convertCsvToArray($scope.agreeTermsFieldsCsv);
            $scope.options.emailSettings.usernameList = OptionsService.convertCsvToArray($scope.emailUsernameListCsv);
            $scope.options.emailSettings.hostnameList = OptionsService.convertCsvToArray($scope.emailHostnameListCsv);
            OptionsService.saveOptions();
            $scope.messages.success = true;

            $timeout(function () {
                $scope.messages.success = false;
            }, 5000);
        };

        $scope.reset = function () {
            OptionsService.getOptions().then(function (options) {
                $scope.options = options;
            });

            $scope.ignoredFieldsCsv = $filter('toCsv')($scope.options.ignoredFields);
            $scope.confirmFieldsCsv = $filter('toCsv')($scope.options.confirmFields);
            $scope.agreeTermsFieldsCsv = $filter('toCsv')($scope.options.agreeTermsFields);
            $scope.emailUsernameListCsv = $filter('toCsv')($scope.options.emailSettings.usernameList);
            $scope.emailHostnameListCsv = $filter('toCsv')($scope.options.emailSettings.hostnameList);
        };

        $scope.isMatchFieldsRequired = function () {
            return !($scope.options.fieldMatchSettings.matchClass
                || $scope.options.fieldMatchSettings.matchId
                || $scope.options.fieldMatchSettings.matchLabel
                || $scope.options.fieldMatchSettings.matchName)
        };
    });

    OptionsService.getKeyboardShortcuts().then(function (commands) {
        $scope.keyboardShortcuts = commands;
    });
}]);