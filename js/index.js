/**
 * Created by su on 2017/5/9.
 */

var Web3 = require('web3');
var web3 = new Web3(Web3.providers.givenProvider || new Web3.providers.HttpProvider("http://localhost:8545"));
angular.module("app", []).controller("hello", function ($scope) {
    $scope.h = function () {
        $scope.info = web3.personal;
    }
});

