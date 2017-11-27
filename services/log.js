/**
 * Created by Mark on 03/08/2015.
 */

angular.module('scanner').service('log', function (settings) {
    var log = {};
    log.logMsg = function (msg) {
        if (settings.log_enabled == true) {
            console.log(msg);
        }
    }
    return log;
});