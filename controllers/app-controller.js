/**
 * Created by StevenChapman on 13/07/15.
 */
var app = angular.module('scanner');

app.controller('scan',
    [
        '$scope',
        'qrfactory',
        '$state',
        'orderconfig',
        '$http',
        'orderid',
        '$timeout',
        'settingsconfig',
        'log',
        function ($scope, qrfactory, $state, orderconfig, $http, orderid, $timeout, settingsconfig, log) {
            $scope.displayIndicator = false;
            $scope.reportData={};

            $scope.getStages = function () {
                orderconfig.getStages().then(function (_data) {
                    $scope.availableStages = _data.data;
                });
            }

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

            $scope.qr = {}
            $scope.$on('$viewContentLoaded',
                function (event, viewConfig) {
                    if ($state.current.name == 'scan') {
                        log.logMsg('View is scan')
                        qrfactory.reset();
                        qrfactory.scan().then(function (_data) {
                            log.logMsg("Scan complete with data");
                            $scope.qr.qrresult = _data;
                            $state.go('scan-result-flow');
                        });
                    }
                });

            $scope.version = settingsconfig.getVersion();

            //Get Settings from Local Variables - these are then stored in the settings service
            settingsconfig.getSettingsFromLocalVariables('settings').then(function (_data) {
                log.logMsg('Got Settings from Local Variables')
                $scope.settings = _data;
                $scope.getStages();
                //If any of the variables are blank - then display settings screen.
                if ($scope.settings.user.name == '' || $scope.settings.user.password == '' || $scope.settings.station == '' || $scope.settings.server == '') {
                    log.logMsg('ERROR >> Settings missing')
                    $scope.changestate('settings');
                }
            }, function (err) {
                log.logMsg('ERROR >> Settings missing')
                $scope.changestate('settings');
            })


            $scope.reloadApp = function () {
                log.logMsg('Reloading App')
                chrome.runtime.reload();
            };

            $scope.changestate = function (s) {
                log.logMsg('VIEW >> ' + s)
                $state.go(s);
            };

            $scope.resetScanMessage = function () {
                log.logMsg('Resetting Scan Message');
                $scope.scanErr = false;
                $scope.scanSucc = false;
                $scope.changestate('scan home')
            };

            //Called from the Manual Entry Button
            $scope.resetManualMessage = function () {
                log.logMsg('Resetting Manual Message');
                $scope.manualerr = false;
            };


            //Manual Method for entering product code - passed the code the user entered
            $scope.lookupOrder = function (code) {
                log.logMsg('Manual Lookup Order Called ' + code)
                $scope.manualerr = false;
                if (!code) {
                    console.log("ERROR >> Missing Order ID")
                    $scope.manualerr = true;
                    return;
                }
                //Set this code on the orderid service - this is then passed through the normal lookup flow
                orderid.setOrderId(code);
                $scope.changestate('scan-result-flow');
            };

            $scope.outDepartment=""

            //Command(s) - send command to Server to update Order
            $scope.sendCommand = function (command,outDepartment) {
                orderconfig.sendCommand(orderid.getOrderId(), command,outDepartment)
                    .then(function (_data) {
                        log.logMsg('Success with command')
                        $scope.scanErr = false;
                        $scope.scanSucc = true;
                        $scope.scanresult = 'Thank you. Your order has been scanned in and updated successfully.';
                    }, function (err) {
                        log.logMsg('ERROR >> Error with command ' + err.statusText)
                        $scope.scanErr = true;
                        $scope.scanSucc = false;
                        $scope.scanresult = err.statusText;
                    });
            }


            //Hide / show action button - checks Order Data which holds which buttons to display sent from server
            $scope.hasButton = function (key) {
                if (orderid.orderObject.buttons) {
                    for (var i = 0; i < orderid.orderObject.buttons.length; i++) {
                        if (orderid.orderObject.buttons[i] === key) {
                            log.logMsg('Order has Command ' + key)
                            return true;
                        }
                    }
                }
                return false;
            }


            //Config code
            $scope.saveConfig = function (val) {
                log.logMsg("Saving Configuration");
                // Check that there's some code there.
                if (!val) {
                    log.logMsg("ERROR >> No Values while saving configuration")
                    message('Error: No value specified');
                    return;
                }
                $scope.settingsUpdate = true;
                // Save it using the Chrome extension storage API.
                chrome.storage.local.set({'settings': val});
                log.logMsg("Setting saved")
                $timeout(function () {
                    chrome.runtime.reload();
                }, 2000);
            }

            $scope.saveDepartment = function (_val) {
             //   $scope.settingsUpdated = true;
                chrome.storage.local.get('settings', function (_data) {
                    var tmp = _data;
                    tmp.settings.station = _val;

                    // Save it using the Chrome extension storage API.
                    chrome.storage.local.set(tmp);

                    log.logMsg("Setting saved")
                   $timeout(function () {
                       settingsconfig.station=_val;
                       $scope.settings=tmp.settings;
                   }, 10);

                })
            }
            //End config code

            //Type ahead code
            $scope.querySearch = function (query) {
                return $http({
                    method: 'POST',
                    data: {
                        'orderid': query,
                        'command': 'typeahead'
                    },
                    url: 'http://' + settingsconfig.serverendpoint + GENERAL_CONFIG.API_URL
                })
                    .then(function (_data) {
                        return _data.data;
                    })

            }
            //End Type ahead code
            $scope.filterFn = function(ob)
            {
                // Do some tests

                if(ob.selectable == 'Yes')
                {
                    console.log(ob)
                    return true; // this will be listed in the results
                }

                return false; // otherwise it won't be within the results
            };
            $scope.filterCurrentDepartment = function(obj)
            {
                // Do some tests
                if(obj.stage !==$scope.settings.station  )
                {
                    return true; // this will be listed in the results
                }

                return false; // otherwise it won't be within the results
            };
            $scope.filterRemoveDispatch= function(obj)
            {
                // Do some tests
                if(obj.stage !=='Dispatch'  )
                {
                    return true; // this will be listed in the results
                }

                return false; // otherwise it won't be within the results
            };
        }])
app.directive('changeStation', function () {
    var theHTML = '<div layout="row" layout-wrap layout-align="center"><h4>Change Your Department</h4></div>'
    theHTML = theHTML + '<div layout="row" layout-wrap layout-align="center">' +
    '<md-button flex="20" ng-repeat="items in availableStages | filter:filterFn" ng-class="{\'md-primary\':settings.station===items.stage}" class="md-raised middleButton" style="margin:10px" ng-click="saveDepartment(items.stage)">'
    theHTML = theHTML + '<h3>{{items.stage}}</h3></md-button></div><div layout="row" layout-margin layout-padding ng-show="settingsUpdated" class="succ"><div flex="100"><h2>Settings updated. The application will now restart.</h2></div></div>'

    return {
        template: theHTML
    }
})