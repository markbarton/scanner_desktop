angular.module('scanner').service('settings', function($q){
    var settings = {};

    //Default Properties
    settings.serverendpoint='';
    settings.username='';
    settings.password='';
    settings.jwt_token='';
    settings.current_department='';
    settings.factory='';
    settings.log_enabled=true;
    settings.departments=[];
    settings.network_status=false; //Indicates if we have a good network connection - will be false initially
    settings.toms_enabled = false; // Are we using the TOMS server
    settings.tomsserverendpoint = ''; // Are we using the TOMS server
    settings.security_check = false; // Are we expecting a user scan first?
    settings.current_user = '';
    settings.userid = '';

    settings.factories=['Birmingham','Sheffield','Redruth']
    //Get Settings from local storage
    //Has to be a promise due to using a Chrome API
    settings.getSettingsFromLocalVariables=function(key){
        var self = this;
      var deferred = $q.defer();

      for(var key in localStorage){
            var checkItem=localStorage.getItem(key);
            if(checkItem){
                if(checkItem.serverendpoint){
                    self.serverendpoint = checkItem.serverendpoint;
                }
                if(checkItem.username){
                    self.username = checkItem.username;
                }
                  if(checkItem.password){
                    self.password = checkItem.password;
                }
                if(checkItem.jwt_token){
                    self.jwt_token = checkItem.jwt_token;
                }
                  if(checkItem.toms_enabled){
                    self.toms_enabled = checkItem.toms_enabled;
                }
                if(checkItem.tomsserverendpoint){
                    self.tomsserverendpoint = checkItem.tomsserverendpoint;
                }
                if(checkItem.security_check){
                    self.security_check = checkItem.security_check;
                }

                if(checkItem.current_department){
                    self.current_department = checkItem.current_department;
                }
                if(checkItem.factory){
                    self.factory = checkItem.factory;
                }else{
                    //Default Birmingham
                    self.factory='Birmingham'
                }
                if(checkItem.departments){
                    self.departments = checkItem.departments;
                }
            }else{
                console.log('no settings')
            }

        }
      deferred.resolve();

      return deferred.promise;

    }


    settings.version='TESTING VERSION';

    settings.saveLocalStorage=function(){
        //if view is passed we are changing state
        var obj={}
        var deferred = $q.defer();
      localStorage.setItem('serverendpoint',this.serverendpoint);
      localStorage.setItem('username',this.username);
      localStorage.setItem('password',this.password);
      localStorage.setItem('departments',this.departments);
      localStorage.setItem('current_department',this.current_department);
      localStorage.setItem('factory',this.factory);
      localStorage.setItem('toms_enabled',this.toms_enabled);
      localStorage.setItem('security_check',this.security_check);
      localStorage.setItem('tomsserverendpoint',this.tomsserverendpoint);
      localStorage.setItem('jwt_token',this.jwt_token);
            deferred.resolve();

        return deferred.promise;
    }


    return settings;
});