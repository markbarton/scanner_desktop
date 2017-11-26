/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function (module) {

  var scanResultController = function (settings, log, $state, $scope, current_order, orderconfig, $mdDialog, $rootScope) {

    var vm = this;
    vm.user_required = false; // Do we need to display the security section?

    // Security Scanning properties
    vm.chars = [];
    var pressed = false;

    vm.current_user =  '' // The current logged in user;
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
            if (vm.chars.length >= 6) {
              var barcode = vm.chars.join("");
              vm.user_not_active = false;
              vm.user_notfound=false;
              vm.user_notbarcode = false;

              if(barcode.substring(0,4)!=='USER'){
                 // Not a user barcode so return
                 console.log('not user');
                 vm.user_notbarcode = true;
                 vm.chars = [];
                 pressed = false;
                 return;
               }

              // Do we have security enabled and do we have a valid user?
              if(vm.settings.security_check === true && vm.current_user === ''){
                console.log('need user identity');
                orderconfig.user_check(barcode).then(function(_data){
                  console.log(_data);
                  if(_data.data.status!=='Active'){
                    // User not active
                    vm.user_not_active = true;
                    vm.chars = [];
                    pressed = false;
                    return;
                  }
                  if(_data.data.status==='Active'){
                    vm.current_user = _data.data.username;
                    settings.current_user =vm.current_user;
                    settings.userid = barcode;
                    vm.user_required = false;
                  }
                },function(_err){
                  vm.user_notfound=true;
                  vm.chars = [];
                  pressed = false;
                })
                return;

              }
            }
            vm.chars = [];
            pressed = false;
          },500);
        }
        // set press to true so we do not reenter the timeout function above
        pressed = true;
      })
    })

    vm.current_order = {};

    vm.settings = settings;
    $scope.$watch(function () {
      return settings;
    }, function (settings) {
      // handle it here. e.g.:
      vm.settings = settings;
    });

    // Display Security Section
    if (vm.settings.security_check === true && vm.current_user === '') {
    vm.user_required = true;
    }

    $scope.$watch(function () {
      return current_order;
    }, function (current_order) {
      // handle it here. e.g.:
      vm.current_order = current_order;
      getOrderDetails(current_order.orderid);

    });

    function getOrderDetails(orderid) {
      vm.errMsg = ''
      orderconfig.sendCommand(orderid, 'check').then(function (_data) {
        if (_data.data.order) {
          log.logMsg("Success in getting Order " + _data.data.order.orderid);
          vm.current_order = _data.data.order;
        }
        else {
          log.logMsg("ERROR >> No Order found but we got a HTTP 200");
          //Need to display error
          vm.errMsg = 'No Order Information was found for ' + vm.current_order.orderid
        }
        ;
      }, function (err) {
        log.logMsg("ERROR >> " + err);
        if (err.statusText == '') {
          err.statusText = 'A connection error has occurred. No data can be retrieved. Click OK to edit / check your settings.'
        }
        //Need to display error
        vm.errMsg = 'A connection error has occurred. No data can be retrieved. Click OK to edit / check your settings.'
        vm.displayIndicator = false;
      });
    }

    //Hide / show action button - checks Order Data which holds which buttons to display sent from server
    vm.hasButton = function (key) {
      if (vm.current_order.buttons) {
        for (var i = 0; i < vm.current_order.buttons.length; i++) {
          if (vm.current_order.buttons[i] === key) {
            return true;
          }
        }
      }
      return false;
    }

    vm.change_state = function (s) {
      log.logMsg('VIEW >> ' + s)
      $state.go(s);
    };

    vm.filterFn = function (ob) {
      // Do some tests

      if (ob.selectable == 'Yes') {
        return true; // this will be listed in the results
      }

      return false; // otherwise it won't be within the results
    };
    vm.filterCurrentDepartment = function (obj) {
      // Do some tests
      if (obj.stage !== settings.current_department) {
        return true; // this will be listed in the results
      }

      return false; // otherwise it won't be within the results
    };
    vm.filterRemoveDispatch = function (obj) {
      // Do some tests
      if (obj.stage !== 'Dispatch') {
        return true; // this will be listed in the results
      }

      return false; // otherwise it won't be within the results
    };

    vm.outDepartment = ""

    //Command(s) - send command to Server to update Order
    vm.sendCommand = function (command, outDepartment) {
      orderconfig.sendCommand(vm.current_order.orderid, command, outDepartment)
        .then(function (_data) {
          log.logMsg('Success with command')


          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('Success')
              .textContent('Thank you.  Your order has been scanned and updated successfully')
              .ok('Ok!')
          ).then(function () {
            settings.current_user = ''
            vm.change_state('scan home')
          });


        }, function (err) {
          log.logMsg('ERROR >> Error with command ' + err.statusText)
          vm.errMsg = 'Error trying to send order update ' + err.statusText
        });
    }


  };

  module.controller("scanResultController", scanResultController);

}(angular.module("scanner")));