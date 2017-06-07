/**
 * Created by su on 2017/6/7.
 */

var testAbi = [{
    "constant": false,
    "inputs": [],
    "name": "getCap",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "getSender",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "type": "function"
}, {"constant": false, "inputs": [], "name": "addTime", "outputs": [], "payable": false, "type": "function"}];

var testContract = web3.eth.contract(testAbi);
var testContractInstance = testContract.at("0x19A57f50EEB295D360E148aAaB5573CC3Ad4DeB2");

angular.module("app", []).controller("test", function ($scope) {

    var a = testContractInstance.getSender.call({
        from: "0xe6Bae6D2657b6b6658Cae2EcC1f7AE1A9e58FE75",
    });
    alert(a);
    //$scope.a = web3.eth.getTransactionReceipt("0x16116e7aa8a5f77b0f073901103b1aec658fbd5315a64fbe4f56b91dd9d3c31f");

});

//查看cap时发送交易，如果交易不报错就调用对应的call函数显示capability，缺陷是任何人都能伪造地址进行调用，因此区块链主要还是记录功能
//最好能够通过查看历史交易，发现各类调用的原始交易形式