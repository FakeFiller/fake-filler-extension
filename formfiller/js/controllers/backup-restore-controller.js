app.controller('BackupAndRestoreController', ['$scope', '$route', '$window', 'OptionsService', function ($scope, $route, $window, OptionsService) {
    $scope.messages = { success: false, error: false, errorMessage: null };

    $scope.openFileDialog = function () {
        var element = angular.element('#restoreFileSelector');
        element.trigger('click');
    };

    $scope.exportSettings = function () {
        OptionsService.getOptions().then(function (options) {
            var encodedData = $scope.utf8_to_b64(angular.toJson(options)),
                dateStamp = moment().format('YYYY-MM-DD');

            try {
                var blob = new Blob([encodedData], {type: 'text/plain;charset=utf-8'});
                saveAs(blob, 'form-filler-' + dateStamp + '.txt');
            } catch (e) {
                $scope.messages.errorMessage = 'Error creating a backup file: ' + e.toString();
                $scope.messages.error = true;
                console.error(e);
            }
        });
    };

    $scope.importSettings = function ($event) {
        var inputElement = $event.target;
        if (inputElement.files.length == 1 && inputElement.files[0].name.length > 0) {
            if (confirm('Are you sure you want to restore the settings?\n\nNote: Existing settings will be replaced.')) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    try {
                        var decodedData = $scope.b64_to_utf8(e.target.result),
                            options = angular.fromJson(decodedData);

                        OptionsService.saveImportedOptions(options);
                        $scope.$apply(function () {
                            $scope.messages.error = false;
                            $scope.messages.success = true;
                        });
                    }
                    catch (e) {
                        $scope.$apply(function () {
                            $scope.messages.errorMessage = 'Error importing from file: ' + e.toString();
                            $scope.messages.error = true;
                        });
                        console.error(e);
                    }
                };
                fileReader.onerror = function () {
                    $scope.$apply(function () {
                        $scope.messages.errorMessage = 'Error reading backup file.';
                        $scope.messages.error = true;
                    });
                };
                fileReader.readAsText(inputElement.files[0]);
            }
        }
    };

    $scope.utf8_to_b64 = function (str) {
      return $window.btoa(unescape(encodeURIComponent(str)));
    };

    $scope.b64_to_utf8 = function (str) {
      return decodeURIComponent(escape($window.atob(str)));
    };
}]);
