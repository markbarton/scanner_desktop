/**
 * Created by StevenChapman on 19/05/15.
 */
var app = angular.module('scanner', ['ngMaterial', 'ngMdIcons', 'ui.router', 'http-post-fix', 'scanner.config','angular-loading-bar','wj']);

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
                console.log('linked');
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

angular.module('http-post-fix', [], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, subName, fullSubName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

