/**
 * Created by su on 2017/5/20.
 */
angular.module("app", []).controller("search", function ($scope) {
    //重置函数
    $scope.reset = function () {
        $scope.dataName = "";
        $scope.dpAddress = "";
        $scope.dataProvider = "";
        $scope.introduction = "";
    }
    
    $scope.searchDataByName = function () {
        //获取数据合约
        var dpContract = web3.eth.contract(abiDataProfile);

        //若不输入字符串
        if (typeof ($scope.dataName) == "undefined") {
            alert("Please input the data name first!");
            $scope.reset();
            return;
        }
        //转换名字编码
        var dataName = web3.fromAscii($scope.dataName);
        //获取数据合约
        $scope.dpAddress = drcContractInstance.DPAddress.call(dataName);

        //若找不到数据
        if (parseInt($scope.dpAddress) == 0) {
            alert("Can not find the data!");
            $scope.reset();
            return;
        }

        //取出数据详情
        var dpContractInstance = dpContract.at($scope.dpAddress);
        //数据提供者
        $scope.dataProvider=drcContractInstance.data_provide.call($scope.dataName);
        //获取数据具体信息
        //默认取出数组第一个值
        var introName = dpContractInstance.introName.call();
        $scope.introduction = dpContractInstance.introductions.call(introName);
    };

    $scope.searchDataByType = function () {
        alert("not finish yet");
    };
});