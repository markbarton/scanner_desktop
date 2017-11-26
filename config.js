/**
 * Created by StevenChapman on 13/07/15.
 */
/**
 * Created by Mark on 08/01/2015.
 */

var config_module = angular.module('scanner.config', []);
var config_data = {
    'GENERAL_CONFIG': {
        'API_URL': '/data.xsp' //Node Server for API
    }
}
angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
})