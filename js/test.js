/**
 * Created by su on 2017/5/20.
 */
angular.module("app", []).controller("test", function ($scope) {
    $scope.items = [{key: "", value: ""}];

    $scope.add = function () {
        var item = {key: "", value: ""};
        $scope.items.push(item);
    };
    $scope.remove = function () {
        $scope.items.splice($scope.items.length - 1, 1);
    };
});