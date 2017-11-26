/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function (module) {

    var reportController = function (log, $scope, reportData,current_order, $state) {

        var vm = this;
        vm.change_state = function (s) {
            log.logMsg('VIEW >> ' + s)
            $state.go(s);
        };


        
        if(reportData.data){
            if(reportData.data.data){
                vm.department_late=0;
                vm.department_warning=0;
                vm.late=0;
                vm.warning=0;
                vm.reportData=reportData.data.data.Orders;
                for(var i=0;i<vm.reportData.length;i++){
                    if(vm.reportData[i].daysAfterScan>4){
                        vm.department_late+=1;
                    }
                    if(vm.reportData[i].daysAfterScan>2 && vm.reportData[i].daysAfterScan<5){
                        vm.department_warning+=1;
                    }
                    if(vm.reportData[i].daysBeforeManufacture<1){
                        vm.late+=1;
                    }
                    if(vm.reportData[i].daysBeforeManufacture<4 && vm.reportData[i].daysBeforeManufacture>0){
                        vm.warning+=1;
                    }
                }
            }

        }
       
        vm.lookupOrder=function(order_id){
            current_order.orderid = order_id;
            $state.go('scan-result');
        }

    };

    module.controller("reportController", reportController);

}(angular.module("scanner")));