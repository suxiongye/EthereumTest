/**
 * Created by su on 2017/5/18.
 */
angular.module("app", []).controller("data", function ($scope) {
    $scope.getDatas = function () {
        //获取数据数目
        var dataSetNum = drcContractInstance.dnaLength.call().toNumber();

        //获取数据合约
        var dpContract = web3.eth.contract(abiDataProfile);

        //遍历数据，存入数组
        $scope.dataSets = [];
        for (var i = 0; i < dataSetNum; i++) {
            var dataSet = [];
            //获取名字
            var dataName = drcContractInstance.dataNameArray.call(i);
            dataSet.dataName = web3.toAscii(dataName);
            //获取数据合约
            dataSet.address = drcContractInstance.DPAddress.call(dataName);
            var dpContractInstance = dpContract.at(dataSet.address);

            //获取数据具体信息
            //默认取出数组第一个值
            var introName = dpContractInstance.introName.call();
            dataSet.introduction = dpContractInstance.introductions.call(introName);
            //存入数组
            $scope.dataSets.push(dataSet);
        }

    };
});
