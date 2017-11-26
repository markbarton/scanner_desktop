/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function(module) {

    var homeController = function(settings,log,$state,$scope,$rootScope,current_order,orderconfig) {

        var vm = this;
        vm.identified = ''; // new security check

        vm.chars = [];
        var pressed = false;
        $rootScope.$on('keypress', function (evt, obj, key) {
            $scope.$apply(function () {
                 if (obj.which >= 44 && obj.which <= 90) {

                     vm.chars.push(key);
                 }
                if (pressed == false) {
                    // we set a timeout function that expires after 1 sec, once it does it clears out a list
                    // of characters
                    setTimeout(function(){
                        // check we have a long length e.g. it is a barcode
                        console.log('here',vm.chars)
                        if (vm.chars.length >= 6) {
                          var barcode = vm.chars.join("");

                          if(barcode.substring(0,4)==='USER'){
                            // Not a user barcode so return
                            vm.chars = [];
                            pressed = false;
                            return;
                          }
                            // join the chars array to make a string of the barcode scanned
                            // debug barcode to console (e.g. for use in Firebug)
                            console.log("Barcode Scanned: " + barcode);
                            current_order.orderid=barcode;
                            $state.go('scan-result');
                            // assign value to some input (or do whatever you want)

                        }
                        vm.chars = [];
                        pressed = false;
                    },500);
                }
                // set press to true so we do not reenter the timeout function above
                pressed = true;
            });
        })

        //Check to see if we have local settings first
        settings.getSettingsFromLocalVariables('scanner_settings').then(
            function(_data){
            //Settings Service now populated
               console.log('Have local settings')
                getStats();
               console.log(_data);
            },

            function(err){
                //Missing settings
                console.log(err)
                log.logMsg('ERROR >> Settings missing');
                $state.go('settings');
            }
        )
        $scope.$watch( function () { return settings; }, function ( settings ) {
            // handle it here. e.g.:
            vm.settings= settings;

        });

        vm.saveDepartment=function(department){
            //Save department to settings
            settings.current_department=department;
            //Update local storage
            settings.saveLocalStorage();
            getStats();

        }
        vm.change_state = function (s) {
            log.logMsg('VIEW >> ' + s)
            $state.go(s);
        };

        vm.filterFnInternal = function(ob)
        {
            if(ob.selectable == 'Yes' && ob.externalCompany !=='Yes')
            {
                 return true; // this will be listed in the results
            }
            return false; // otherwise it won't be within the results
        };
        vm.filterFnExternal = function(ob)
        {
            if(ob.selectable == 'Yes' && ob.externalCompany ==='Yes')
            {
                 return true; // this will be listed in the results
            }
            return false; // otherwise it won't be within the results
        };

         function getStats(){
             vm.department_late=0;
             vm.department_warning=0;
             vm.late=0;
             vm.warning=0;
             vm.on_time=0;
             vm.reportData='';
            orderconfig.sendCommand('','report').then(function (_data) {
                if(_data.data){
                        vm.reportData=_data.data.Orders;

                    for(var i=0;i<vm.reportData.length;i++){
                        if(vm.reportData[i].daysAfterScan>4){
                            vm.department_late+=1;
                        }
                        if(vm.reportData[i].daysAfterScan==4){
                            vm.department_warning+=1;
                        }
                        if(vm.reportData[i].daysBeforeManufacture<1){
                            vm.late+=1;
                        }
                        if(vm.reportData[i].daysBeforeManufacture<4){
                            vm.warning+=1;
                        }
                    }
                    vm.on_time=(vm.reportData.length-vm.department_late)-vm.department_warning;

                }
            })

        }



    };

    module.controller("homeController", homeController);

}(angular.module("scanner")));