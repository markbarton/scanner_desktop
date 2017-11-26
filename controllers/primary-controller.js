/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function(module) {

    var primaryController = function(log,$state,$scope,settings) {

        var vm = this;



        vm.displayLoading=false;
        $scope.$watch( function () { return settings; }, function ( settings ) {
            // handle it here. e.g.:
            vm.settings= settings;
        });

        vm.change_state = function (s) {
            log.logMsg('VIEW >> ' + s)
            $state.go(s);
        };

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.resolve) {
                console.log("Showing Spinner")
                $scope.displayIndicator = true;
                //$scope.showSpinner();
            }
        });
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.resolve) {
                console.log("Hiding Spinner")
                $scope.displayIndicator = false;
                // $scope.hideSpinner();
            }
        });


    };

    module.controller("primaryController", primaryController);

}(angular.module("scanner")));

