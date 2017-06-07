/**
 * Created by su on 2017/5/28.
 */
angular.module("app", []).controller("personalData", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = getRegisterAccounts();
    $scope.dataSets = [];
    $scope.provideSum = 0;
    $scope.requestSum = 0;

    /**
     * 页面加载完后自动显示第一个用户名
     */
    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.accounts.length > 0) {
            $scope.selectedAccount = $scope.accounts[0].userName;
        }
    });

    /**
     * 获取提供数据列表
     */
    function getProvideDataList() {
        $scope.provideDataSet = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取提供者提供的数据总数
        var provideNum = contractInstance.getDataNumByProvider.call(accountAddress).toNumber();
        $scope.provideSum = provideNum;
        //逐个获取数据对象
        for (var i = 0; i < provideNum; i++) {
            var dataSet = [];
            dataSet.dataName = web3.toAscii(contractInstance.getProvideDataNameByIndex.call(accountAddress, i));
            //根据数据名称获取数据对象合约
            var dataObjectInstance = dataContract.at(contractInstance.getDataAddressByDataName.call(dataSet.dataName));
            //获取对象类型
            dataSet.types = [];
            for (var j = 0; j < dataObjectInstance.typeNum().toNumber(); j++) {
                //循环添加类型
                var type = [];
                type.key = web3.toAscii(dataObjectInstance.dataTypes(j)[0]);
                type.value = web3.toAscii(dataObjectInstance.dataTypes(j)[1]);
                dataSet.types.push(type);
            }
            //获取权限对象
            var accessObjectContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataSet.dataName));
            dataSet.requestNum = accessObjectContractInstance.requesterNum().toNumber();
            $scope.provideDataSet.push(dataSet);
        }
    }


    /**
     * 获取请求数据列表
     */
    function getRequestDataList() {
        $scope.requestDataSet = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取请求数据数量
        var requestDataNum = contractInstance.getDataNumByRequester.call(accountAddress).toNumber();
        $scope.requestSum = requestDataNum;
        for (var i = 0; i < requestDataNum; i++) {
            //获取数据名称
            var data = [];
            data.dataName = web3.toAscii(contractInstance.getRequestDataNameByIndex.call(accountAddress, i));
            //获取对应名称的权限合约
            var accessContractInstance = accessContract.at(contractInstance.getDataAccessByName.call(data.dataName));
            data.provider = getUserNameByAddress(accessContractInstance.provider());
            //获取当前状态
            data.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(accountAddress))];
            //获取当前请求备注信息
            var requestContractInstance = requestContract.at(contractInstance.getDataRequest.call(data.dataName, accountAddress));
            data.information = requestContractInstance.information();
            data.cap = $scope.getCapByData(data.dataName);
            //存入数据
            $scope.requestDataSet.push(data);
        }
    }

    /**
     * 获取个人数据列表
     */
    $scope.getPersonalDataList = function () {
        getProvideDataList();
        getRequestDataList();
    }


    $scope.refresh = function () {
        $scope.getPersonalDataList();
    };

    $scope.getCapByData = function (dataName) {
        //获取数据权限对象，call函数默认采用节点第一个账户调用，因此不建议用第一个账户创建数据
        var dataAccessInstance = accessContract.at(contractInstance.getDataAccessByName.call(dataName));
        return dataAccessInstance.getCapability.call().then(console.log);
    };
});