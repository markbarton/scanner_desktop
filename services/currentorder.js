angular.module('scanner').service('current_order', function($q){
    var current_order = {};

    //Default Properties
    current_order.orderid=''; //set by the scanner



    return current_order;
});