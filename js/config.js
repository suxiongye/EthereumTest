/**
 * Created by su on 2017/5/14.
 */
//管理合约
var contractAddress = "0x636686f197cAc0501C4C9d77E04A53D959f9A5C8";
var abi = [{
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

//注册合约
var abiDrc = [{
    "constant": true,
    "inputs": [{"name": "", "type": "bytes32"}],
    "name": "DRAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "getDPAddress",
    "outputs": [{"name": "dp", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "dataNameArray",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "getProvider",
    "outputs": [{"name": "providerAddr", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "bytes32"}],
    "name": "DPAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "bytes32"}],
    "name": "data_provide",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "dnaLength",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}],
    "name": "getDRAddress",
    "outputs": [{"name": "drec", "type": "address"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "dataName", "type": "bytes32"}, {
        "name": "introductionName",
        "type": "bytes32"
    }, {"name": "introductionValue", "type": "string"}, {"name": "provider", "type": "address"}],
    "name": "register",
    "outputs": [],
    "payable": false,
    "type": "function"
}];

//数据合约
var abiDataProfile = [{
    "constant": false,
    "inputs": [{"name": "introductionName", "type": "bytes32"}, {"name": "introductionValue", "type": "string"}],
    "name": "updateIntroduction",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "introductionName", "type": "bytes32"}, {"name": "introductionValue", "type": "string"}],
    "name": "addIntroduction",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "bytes32"}],
    "name": "introductions",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "introName",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "introductionName", "type": "bytes32"}],
    "name": "getIntroduction",
    "outputs": [{"name": "introValue", "type": "string"}],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "introductionName", "type": "bytes32"}],
    "name": "deleteIntroduction",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {"inputs": [{"name": "name", "type": "bytes32"}], "payable": false, "type": "constructor"}];

//获取注册合约
var myContract = web3.eth.contract(abi);
var myContractInstance = myContract.at(contractAddress);
var drcAddress = myContractInstance.drc.call();
var drcContract = web3.eth.contract(abiDrc);
var drcContractInstance = drcContract.at(drcAddress);

angular.module("app", []).controller("config", function ($scope) {
    // managementContractAddress = $scope.contractAddress;
});
