/**
 * Created by su on 2017/5/14.
 */

var managementContractAddress;
angular.module("app", []).controller("config", function ($scope) {
    managementContractAddress = $scope.contractAddress;
});
