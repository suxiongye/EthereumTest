/**
 * Created by su on 2017/5/12.
 */
angular.module("app", []).controller("provide", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = web3.eth.accounts;
    $scope.provideData = function () {
        //解锁账户
        web3.personal.unlockAccount($scope.selectedAccount, $scope.password);

        myContractInstance.dataRegister($scope.dataName, "introduction", $scope.introduction, $scope.type_level1, $scope.type_level2, {
            from: $scope.selectedAccount,
            gas: 80000000
        });
    };

    $scope.showProvideList = function () {
        
    }
});
