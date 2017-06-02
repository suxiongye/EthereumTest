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
//记录已经注册的用户
var registerAccounts = [];

/**
 * 解锁账户
 * @param accountAddress
 * @param password
 */
function unlockEtherAccount(accountAddress, password) {
    //解锁账户
    try {
        web3.personal.unlockAccount(accountAddress, password);
        return true;
    } catch (err) {
        console.log(err);
        alert("You haven't connect to ethereum or the password cannot match the account!");
        return false;
    }
}

/**
 * 获取所有已经注册的用户
 */
function getRegisterAccounts() {
    var allUser = web3.eth.accounts;
    registerAccounts = [];
    //循环判断所有账户名称
    for (var i = 0; i < allUser.length; i++) {
        if (isTheUserAddressRegister(allUser[i])) {
            var account = [];
            account.address = allUser[i];
            account.userName = getUserNameByAddress(account.address);
            registerAccounts.push(account);
        }
    }
    return registerAccounts;
}

/**
 * 根据地址返回用户名
 * @param accountAddress
 * @returns {string}
 */
function getUserNameByAddress(accountAddress) {
    //判断用户是否存在
    if (!isTheUserAddressRegister(accountAddress)) return "";
    //返回用户名
    return web3.toAscii(contractInstance.getUserNameByAddress.call(accountAddress));
}
/**
 * 根据用户名返回地址
 * @param userName
 * @returns {*}
 */
function getUserAddressByName(userName) {
    return contractInstance.getUserAddressByName.call(userName);
}

/**
 * 根据用户地址返回是否已经注册
 * @param address
 * @returns {boolean}
 */
function isTheUserAddressRegister(address) {
    return contractInstance.isUserAddressExist.call(address);
}

