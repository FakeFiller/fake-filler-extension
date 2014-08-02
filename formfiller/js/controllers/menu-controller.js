app.controller('MenuController', ['$scope', '$location', '$route', 'OptionsService', function ($scope, $location, $route, OptionsService) {
    $scope.activePath = null;

    $scope.$on('$routeChangeSuccess', function () {
        $scope.activePath = $location.path();
    });

    $scope.resetToFactory = function () {
        if (confirm('Are you sure you want to reset to the default settings?')) {
            OptionsService.resetToFactorySettings();
            $route.reload();
        }
    };
}]);