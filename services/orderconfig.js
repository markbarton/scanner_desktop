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
      var factory=settings.factory._id;

      username=settings.username;
      password=settings.password;

      return $http({
        method: 'POST',
        data: {
          'orderid': userid,
          'command': 'user',
          'version':version
        },
        headers: {'Authorization': settings.jwt_token},
        url: url,
        timeout:15000
      })

    }

    this.get_order=function(order_id){
      var url='http://' + settings.serverendpoint +'/api/order/'+order_id;
      log.logMsg('EXTERNAL >> getting order - '+order_id+' >> ' + url );

      var username="";
      var password="";
      var station="";
      var nextDepartment="";
      var version=settings.version;
      var factory=settings.factory._id;
      var current_user = "";
      var userid = "";

      // Security Settings
      if(settings.security_check && settings.current_user){
        current_user = settings.current_user;
        if(settings.userid){
          userid=settings.userid;
        }
      }

      if(settings.current_department){
        station=settings.current_department._id;
      }
      return $http({
        method: 'GET',
        headers: {'Authorization': settings.jwt_token},
        url: url,
        timeout:15000
      })


    }

    this.scan_in = function(orderid, nextstage){
      log.logMsg('EXTERNAL >> Scan In '+orderid+' >> '+ nextstage.name);
      var url='http://' + settings.serverendpoint +'/api/command/scan_in'
      var _data={};
      _data.new_section = nextstage._id;
      _data.station_id = '';
      _data.orderid = orderid;

      return $http({
        method: 'POST',
        data: _data,
        headers: {'Authorization': settings.jwt_token},
        url: url,
        timeout:15000
      })


    }

    //Command to send to service
    //This will cover check, in, out, outreject
    this.sendCommand=function(orderid,command,nextstage){
        console.log("Next Stage: " + nextstage)
        var url='http://' + settings.serverendpoint +'/api/command'
        log.logMsg('EXTERNAL >> sendCommand ('+command+') - '+orderid+' >> ' + url + ' - '+ nextstage);

        var username="";
        var password="";
        var station="";
        var nextDepartment="";
        var version=settings.version;
        var factory=settings.factory._id;
        var current_user = "";
        var userid = "";

      if(nextstage){
            nextDepartment=nextstage._id;
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
            station=settings.current_department._id;
        }
        return $http({
            method: 'POST',
            data: {
                'orderid': orderid,
                'command': command,
                'currentstage':station,
                'nextstage':nextDepartment,
                'factory':factory,
                'version':version,
                'current_user':current_user,
                'userid':userid
            },
          headers: {'Authorization': settings.jwt_token},
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
          headers: {'Authorization': settings.jwt_token},
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
      console.log(settings.factory);
        var url='http://' + settings.serverendpoint + '/api/sections/'+settings.factory.id;
        log.logMsg('EXTERNAL >> getDepartments >> ' + url);

        var factory=settings.factory.id;

        return $http({
            method: 'GET',
            timeout: 15000,
            url: url,
          headers: {
            'Authorization': settings.jwt_token}
        });
    }

    this.resetConnectionError = function () {
        $scope.connectionError = false;
    }

}])