angular.module('scanner').service('settings', function ($q,localStorageService) {
  var settings = {};

  //Default Properties
  settings.serverendpoint = '';
  settings.username = '';
  settings.password = '';
  settings.jwt_token = '';
  settings.current_department = '';
  settings.factory = {};
  settings.log_enabled = true;
  settings.departments = [];
  settings.network_status = false; //Indicates if we have a good network connection - will be false initially
  settings.toms_enabled = false; // Are we using the TOMS server
  settings.tomsserverendpoint = ''; // Are we using the TOMS server
  settings.security_check = false; // Are we expecting a user scan first?
  settings.current_user = '';
  settings.userid = '';

  settings.factories = [{ name: 'Birmingham', id: 'rJAb8H1lG' }, { name: 'Sheffield', id: 'S14IRdulM' }];
  //Get Settings from local storage
  //Has to be a promise due to using a Chrome API
  settings.getSettingsFromLocalVariables = function (key) {
    var self = this;
    var deferred = $q.defer();
    var scanner_settings = localStorageService.get('scanner_settings');

    for (var key in scanner_settings) {
      self[key]=scanner_settings[key];
    }
    deferred.resolve();

    return deferred.promise;

  }


  settings.version = 'TESTING VERSION';

  settings.saveLocalStorage = function () {
    //if view is passed we are changing state
    var deferred = $q.defer();
    var obj={};
    obj.serverendpoint = this.serverendpoint;
    obj.username= this.username;
    obj.password= this.password;
    obj.departments= this.departments;
    obj.current_department= this.current_department;
    obj.factory= this.factory;
    obj.toms_enabled= this.toms_enabled;
    obj.security_check= this.security_check;
    obj.tomsserverendpoint= this.tomsserverendpoint;
    obj.jwt_token= this.jwt_token;
    localStorageService.set('scanner_settings',obj);

    deferred.resolve();

    return deferred.promise;
  }


  return settings;
});