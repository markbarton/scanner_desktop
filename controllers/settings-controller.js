/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function (module) {

  var settingsController = function ($scope, settings, log, orderconfig, $mdDialog, $state) {

    var vm = this;
    vm.saveError = ''; //If there is an error when saving and then testing the settings
    vm.displayLoading = false;
    $scope.$watch(function () {
      return settings;
    }, function (settings) {
      // handle it here. e.g.:
      vm.settings = settings;
    });
    if(!vm.settings){
      settings.getSettingsFromLocalVariables('scanner_settings');
    }

    $scope.$watch(
      "vm.factory",
      function handleFooChange(newValue, oldValue) {
        //Get list of departments if we have password,username and endpoint etc
        if (vm.settings.username && vm.settings.password && vm.settings.serverendpoint) {
          vm.getDepartments();
        }

      }
    );

    vm.login = function () {
      vm.displayLoading = true;
      log.logMsg("Testing Login");
      vm.saveError = ''
      orderconfig.login().then(function success(data) {
        console.log(data)
        log.logMsg("Success Logging in");
        settings.network_status = true;
        settings.jwt_token = 'Bearer '+data.data.token;
        saveLocalStorage(); //we do this here in case theres a problem with departments

      }, function error(err){
        vm.displayLoading = false;

        vm.saveError = 'Network Problem - it has not been possible to contact the server - is the Endpoint Correct?'
        if (err.status === 401) {
          vm.saveError = 'Not Authorised - Possible incorrect Username & Password'
        }
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title('Connection Error')
            .textContent(vm.saveError)
            .ok('Ok!')
        );
      })
    }

    vm.testConnection = function () {
      vm.displayLoading = true;
      log.logMsg("Testing Configuration");
      vm.saveError = ''
//Test Connection First
      orderconfig.testConnection().then(function success(data) {
          log.logMsg("Success connecting");
          settings.network_status = true;
          saveLocalStorage(); //we do this here in case theres a problem with departments
          vm.getDepartments();
        },
        function error(err) {
          vm.displayLoading = false;

          vm.saveError = 'Network Problem - it has not been possible to contact the server - is the Endpoint Correct?'
          if (err.status === 401) {
            vm.saveError = 'Not Authorised - Possible incorrect Username & Password'
          }
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('Connection Error')
              .textContent(vm.saveError)
              .ok('Ok!')
          );
        })
    }

    vm.getDepartments = function () {
      orderconfig.getDepartments().then(function success(results) {
          settings.departments = results.data;
          saveLocalStorage();
          vm.displayLoading = false;
        },
        function error() {
          vm.displayLoading = false;

          vm.saveError = 'Network Problem - there has been a problem getting a list of departments'
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('body')))
              .clickOutsideToClose(true)
              .title('Geting List of Deparments Error')
              .textContent(vm.saveError)
              .ok('Ok!')
          );
        })

    }

    vm.saveSettings = function () {
      log.logMsg("Saving Settings");
      saveLocalStorage('scan home');
    }

    vm.restart = function () {
      chrome.runtime.reload();
    }

    function saveLocalStorage(view) {
      //if view is passed we are changing state

      settings.saveLocalStorage().then(
        function () {
          if (view) {
            $state.go(view)
          }
        }
      )
    }
  };

  module.controller("settingsController", settingsController);

}(angular.module("scanner")));