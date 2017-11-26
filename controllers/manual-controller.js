/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function (module) {

    var manualController = function (log, $scope, current_order, $state) {

        var vm = this;
        vm.change_state = function (s) {
            log.logMsg('VIEW >> ' + s)
            $state.go(s);
        };

        vm.lookupOrder=function(){
            current_order.orderid = vm.manual.code;
            $state.go('scan-result');
        }

    };

    module.controller("manualController", manualController);

}(angular.module("scanner")));