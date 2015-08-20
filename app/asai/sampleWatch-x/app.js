///<reference path="../../../typings/tsd.d.ts" />
var Sample04WatchController = (function () {
    function Sample04WatchController($scope, $timeout) {
        this.menuName = null;
        // $scope.$watch の例
        $scope.$watch('ctrl.menus', function (newValue, oldValue) {
            console.log('old value:' + oldValue);
            console.log('new value:' + newValue);
            $scope.ctrl.menuName = oldValue + 'から' + newValue + 'に変更しました。';
            console.log($scope);
            $timeout(function () {
                $scope.$apply();
                console.log($scope.ctrl);
            }, 0);
        });
        // 現在日付を表示する例
        var updateTime = function () {
            $scope.ctrl.now = new Date();
        };
        updateTime();
        setInterval(function () {
            $scope.$apply(updateTime);
            // console.log($scope.ctrl.now):
        }, 1000);
        // 上記は悪い見本（Dont'sに該当）
        // こういう場合は setInterval ではなく、$interval を使うべき
    }
    return Sample04WatchController;
})();
angular.module('sampleApp', ['ng']).controller('WatchController', ['$scope', '$timeout', Sample04WatchController]);
