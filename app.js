/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router', 'scanner.config','angular-loading-bar','wj','LocalStorageModule']);

app.run(function($rootScope){
    $rootScope.addError=function(err){
        console.log(err);
    }

})

app.directive('keypressEvents',

    function ($document, $rootScope) {
        return {
            restrict: 'A',
            link: function () {
                $document.bind('keypress', function (e) {
                    $rootScope.$broadcast('keypress', e, String.fromCharCode(e.which));
                });
            }
        }
    });

app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,$provide) {

    $mdThemingProvider.definePalette('trulifePalette', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'E8F0FB',
        '400': 'ef5350',
        '500': '2196F3',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': ['50', 'A100']    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('trulifePalette')

    $urlRouterProvider.otherwise('/scan-home');
    $stateProvider
        .state('scan home', {
            url: '/scan-home',
            templateUrl: 'views/partial-scan-home.html',
            controller:'homeController as vm'

        })

        .state('settings', {
            url: '/settings',
            templateUrl: 'views/partial-settings.html',
            controller:'settingsController as vm'
        })

        .state('scan', {
            url: '/scan',
            templateUrl: 'views/partial-scan.html',
            controller:'scanController as vm'
        })
        .state('scan-result', {
            url: '/scan-result',
            templateUrl: 'views/partial-scan-result.html',
            controller:'scanResultController as vm'
        })
        .state('manual', {
            url: '/manual',
            templateUrl: 'views/partial-manual.html',
            controller:'manualController as vm'
        })


        .state('report', {
            url: '/report',
            templateUrl: 'views/partial-report.html',
            controller:'reportController as vm',

            resolve: {
                reportData: function (orderconfig,log) {
                    // $http returns a promise for the url data
                    return orderconfig.sendCommand('','report').then(function (_data) {
                       return {'data':_data,'err':''};
                    }, function (err) {
                     return {'data':'','err':err};
                    });
                }
            }
        })


      $provide.decorator("$exceptionHandler", function($delegate, $injector){
      return function(exception, cause){
      var $rootScope = $injector.get("$rootScope");
      $rootScope.addError({message:"Exception", reason:exception});
      $delegate(exception, cause);
      };
      });



})


