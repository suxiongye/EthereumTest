/**
 * Created by su on 2017/5/12.
 */

var contractAddress = "0xCAfAF4EDe569ef0ac78209dfAc0CA4a5efD3eFb7";
var contractAbi = [{
    "constant": true,
    "inputs": [],
    "name": "req",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "requester",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "requestData",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "Recharge",
    "outputs": [{"name": "flag", "type": "bool"}],
    "payable": true,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {
        "name": "requesterAddress",
        "type": "address"
    }, {"name": "index", "type": "uint256"}],
    "name": "changeAccess",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "DRAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "dt1",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "drc",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "DPAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}],
    "name": "req_reqAddr",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "requesterAddress", "type": "address"}],
    "name": "addNewRequester",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {
        "name": "introductionName",
        "type": "bytes32"
    }, {"name": "introductionValue", "type": "string"}, {"name": "level1", "type": "bytes32"}, {
        "name": "level2",
        "type": "bytes32"
    }],
    "name": "dataRegister",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {"name": "introName", "type": "bytes32"}, {
        "name": "introValue",
        "type": "string"
    }],
    "name": "modifyIntroduction",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {"inputs": [], "payable": false, "type": "constructor"}];
angular.module("app", []).controller("provide", function ($scope) {
    $scope.msg = managementContractAddress;
});
