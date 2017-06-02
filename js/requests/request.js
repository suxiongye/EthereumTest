/**
 * Created by su on 2017/5/28.
 */
angular.module("app", []).controller("request", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = getRegisterAccounts();
    $scope.requestDisabled = true;
    $scope.dataSets = [];
    $scope.information = "";

    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.accounts.length > 0) {
            $scope.selectedAccount = $scope.accounts[0].userName;
        }
    });

    /**
     * 动态检测是否合法
     */
    $scope.isDataLegal = function () {
        if ($scope.isDataExist() || $scope.isDataRequestSame()) {
            $scope.requestDisabled = true;
            return;
        } else {
            if (!$scope.information) {
                $scope.infoError = "Please input the request information";
                return;
            }
            $scope.nameError = "";
            $scope.infoError = "";
            $scope.requestDisabled = false;
        }
    };

    /**
     * 动态搜索对应数据名称是否存在
     */
    $scope.isDataExist = function () {
        if (!$scope.dataName) {
            $scope.nameError = "Please input data name!";
            return true;
        }
        //检查数据名称是否存在
        if (!contractInstance.isDataNameExist.call($scope.dataName)) {
            $scope.nameError = "The data name is not exist!";
            return true;
        }
        return false;
    };

    /**
     * 动态搜索请求者是否与数据提供者相同
     */
    $scope.isDataRequestSame = function () {
        //获取数据对象合约
        var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call($scope.dataName));
        if ($scope.selectedAccount == getUserNameByAddress(dataObjectInstance.provider())) {
            $scope.nameError = "The data requester can't not request own data!";
            return true;
        }
        return false;
    };

    /**
     * 请求数据
     */
    $scope.requestData = function () {
        //解锁账户
        if (!unlockEtherAccount(getUserAddressByName($scope.selectedAccount), $scope.password)) return;

        //发送数据请求(需要添加参数)
        try {
            contractInstance.requestData($scope.dataName, $scope.information, {
                from: getUserAddressByName($scope.selectedAccount),
                gas: 80000000
            });
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * 获取对应请求者请求数据列表
     */
    $scope.getRequestList = function () {
        $scope.dataSets = [];
        var address = getUserAddressByName($scope.selectedAccount);
        //获取请求数据数量
        var requestDataNum = contractInstance.getDataNumByRequester.call(address).toNumber();
        for (var i = 0; i < requestDataNum; i++) {
            //获取数据名称
            var data = [];
            data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call(address, i));
            //获取对应名称的权限合约
            var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(data.dataName));
            data.provider = getUserNameByAddress(accessContractInstance.provider());
            //获取当前状态
            data.status = accessType[accessContractInstance.accessList(address)];
            //获取当前请求备注信息
            var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call(data.dataName, address));
            data.information = requestContractInstance.information();
            //存入数据
            $scope.dataSets.push(data);
        }
    };

});