/**
 * Created by Mark on 29/12/2015.
 */
angular.module('scanner').factory('errors', function($rootScope){
    var errors = {};

    errors.catch= function(message){
        return function(reason){
            $rootScope.addError({message: message, reason: reason})
        };
    }

    return errors;
});