/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function(module) {

    var scanController = function(log,qrfactory,$scope,current_order,$state,settings) {

        var vm = this;
        vm.change_state = function (s) {
            log.logMsg('VIEW >> ' + s)
            $state.go(s);
        };
        $scope.$watch( function () { return settings; }, function ( settings ) {
            // handle it here. e.g.:
            vm.settings= settings;
        });
        $scope.$on('$viewContentLoaded',
            function (event, viewConfig) {
                   qrfactory.reset();
                    qrfactory.scan().then(function (_data) {
                        log.logMsg("Scan complete with data");
                       current_order.orderid = _data;
                        $state.go('scan-result');
                    });
            });
    };

    module.controller("scanController", scanController);

}(angular.module("scanner")));