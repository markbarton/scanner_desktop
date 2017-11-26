/**
 * Created by Mark on 26/05/2015.
 */
var app = angular.module('scanner');
app.service('orderconfig', ['$http', 'GENERAL_CONFIG', 'settings','log', function ($http, GENERAL_CONFIG, settings,log) {


    var stages={}; //The stages

    this.user_check=function(userid){
      var url='http://' + settings.serverendpoint + GENERAL_CONFIG.API_URL
      log.logMsg('EXTERNAL >> User Check- '+userid+' >> ' + url );

      var username="";
      var password="";
      var station="";
      var version=settings.version;
      var factory=settings.factory;

      username=settings.username;
      password=settings.password;

      if(settings.current_department){
        station=settings.current_department;
      }
      return $http({
        method: 'POST',
        data: {
          'orderid': userid,
          'command': 'user',
          'version':version
        },
        headers: {
          'Authorization': 'Basic ' + window.btoa(username+':'+password)},
        url: url,
        timeout:15000
      })

    }

    //Command to send to service
    //This will cover check, in, out, outreject
    this.sendCommand=function(orderid,command,nextstage){
        console.log("Next Stage: " + nextstage)
        var url='http://' + settings.serverendpoint + GENERAL_CONFIG.API_URL
        log.logMsg('EXTERNAL >> sendCommand ('+command+') - '+orderid+' >> ' + url + ' - '+ nextstage);

        var username="";
        var password="";
        var station="";
        var nextDepartment="";
        var version=settings.version;
        var factory=settings.factory;
        var current_user = "";
        var userid = "";

      if(nextstage){
            nextDepartment=nextstage.toLowerCase().replace(/ /g, '')
        }

        username=settings.username;
        password=settings.password;

        // Security Settings
        if(settings.security_check && settings.current_user){
          current_user = settings.current_user;
          if(settings.userid){
            userid=settings.userid;
          }
        }

        if(settings.current_department){
            station=settings.current_department;
        }
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': command,
                'currentstage':station.toLowerCase().replace(/ /g, ''),
                'nextstage':nextDepartment,
                'factory':factory,
                'version':version,
                'current_user':current_user,
                'userid':userid
            },
            headers: {
                'Authorization': 'Basic ' + window.btoa(username+':'+password)},
            url: url,
            timeout:15000
        })

    }

    //Test to ensure we have a network connection
    this.testConnection=function(){
        var url='http://' + settings.serverendpoint + '/api/station/test';
        log.logMsg('EXTERNAL >> test Connection >> ' + url);

        username=settings.username;
        password=settings.password;

        return $http({
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + window.btoa(username+':'+password)},
            url: url,
            timeout:5000
        });

    }

    this.login=function(){
        var url='http://' + settings.serverendpoint + '/system/user/login';
        log.logMsg('EXTERNAL >> Login User >> ' + url);

        username=settings.username;
        password=settings.password;

        return $http({
            method: 'POST',
          data:{username:username,password:password},
            url: url,
            timeout:5000
        });

    }

    this.getDepartments = function () {
        var url='http://' + settings.serverendpoint + GENERAL_CONFIG.API_URL
        log.logMsg('EXTERNAL >> getDepartments >> ' + url);

        username=settings.username;
        password=settings.password;
        var factory=settings.factory;

        return $http({
            method: 'POST',
            data: {
                'command': 'getstages',
                'version':settings.version,
                'factory':factory
            },
            headers: {
                'Authorization': 'Basic ' + window.btoa(username+':'+password)},
            timeout: 15000,
            url: url
        });
    }

    this.resetConnectionError = function () {
        $scope.connectionError = false;
    }

}])