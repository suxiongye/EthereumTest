/**
 * Created by su on 2017/5/28.
 */
angular.module("app", []).controller("personalTask", function ($scope) {
    //账户部分初始化
    //初始取出账户
    $scope.accounts = getRegisterAccounts();
    $scope.taskSets = [];
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
    function getProvideTaskList() {
        $scope.provideTaskSet = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取提供者提供的数据总数
        var provideNum = contractInstance.getTaskNumByProvider.call(accountAddress).toNumber();
        $scope.provideSum = provideNum;
        //逐个获取数据对象
        for (var i = 0; i < provideNum; i++) {
            var taskSet = [];
            taskSet.taskName = web3.toAscii(contractInstance.getProvideTaskNameByIndex.call(accountAddress, i));
            //根据数据名称获取数据对象合约
            var taskObjectInstance = taskContract.at(contractInstance.getTaskAddressByTaskName.call(taskSet.taskName));
            //获取对象类型
            taskSet.types = [];
            for (var j = 0; j < taskObjectInstance.typeNum().toNumber(); j++) {
                //循环添加类型
                var type = [];
                type.key = web3.toAscii(taskObjectInstance.dataTypes(j)[0]);
                type.value = web3.toAscii(taskObjectInstance.dataTypes(j)[1]);
                taskSet.types.push(type);
            }
            //获取权限对象
            var accessObjectContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(taskSet.taskName));
            taskSet.requestNum = accessObjectContractInstance.requesterNum().toNumber();
            $scope.provideTaskSet.push(taskSet);
        }
    }


    /**
     * 获取请求数据列表
     */
    function getRequestTaskList() {
        $scope.requestTaskSet = [];
        var accountAddress = getUserAddressByName($scope.selectedAccount);
        //获取请求数据数量
        var requestTaskNum = contractInstance.getTaskNumByRequester.call(accountAddress).toNumber();
        $scope.requestSum = requestTaskNum;
        for (var i = 0; i < requestTaskNum; i++) {
            //获取数据名称
            var task = [];
            task.taskName = web3.toAscii(contractInstance.getRequestTaskNameByIndex.call(accountAddress, i));
            //获取对应名称的权限合约
            var accessContractInstance = accessContract.at(contractInstance.getTaskAccessByName.call(task.taskName));
            task.provider = getUserNameByAddress(accessContractInstance.provider());
            //获取当前状态
            task.status = accessType[accessContractInstance.accessList(accessContractInstance.requestList(accountAddress))];
            //获取当前请求备注信息
            var requestContractInstance = requestContract.at(contractInstance.getTaskRequest.call(task.taskName, accountAddress));
            task.information = requestContractInstance.information();
            //存入数据
            $scope.requestTaskSet.push(task);
        }
    }

    /**
     * 获取个人数据列表
     */
    $scope.getPersonalTaskList = function () {
        getProvideTaskList();
        getRequestTaskList();
    }


    $scope.refresh = function () {
        $scope.getPersonalTaskList();
    };
});