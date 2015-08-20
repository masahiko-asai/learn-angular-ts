///<reference path="../../../typings/tsd.d.ts" />
var FriendsController = (function () {
    function FriendsController() {
        this.title = 'I wanna make friends (><)';
        this.friends = [{ name: 'hoge', age: 123, gender: 'LGBT' }];
    }
    return FriendsController;
})();
angular.module('sampleApp', ['ng']).controller('RepeatController', FriendsController);
