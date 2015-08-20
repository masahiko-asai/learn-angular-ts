/// <reference path="../../../typings/tsd.d.ts" />
var app = angular.module('sample04App', [])


class ComboBoxDirective implements ng.IDirective {
  scope = {
    selectedItem: '=',
    allItems: '='
  };
  restrict = 'EA';
  transclude = true; // notification タグ内の値をng-transclude内に要素がappendされる
  replace = true; // trueの場合でもnotification タグの属性も引き継がれる
  // ` を付けると + を使わなくてよくなる、angular expression が使えるようになるよ
  template = '<div class="comboBox">' +
    '<input type="text" ng-model="selectedItem">' +
    '<ul ng-show="isFocus">' +
    '<li ng-repeat="item in allItems" ng-click="click($event, item)">' +
    '{{item}}' + 
    '</li>' +
    '</ul>' +
    '</div>';

  controller = ComboBoxDController;
  controllerAs = 'ctrl';
  bindToController = {
    selectedItem: '=',
    allItems: '='
  }
  require = ['refComboBox'];
  link = ($scope, element, attrs, controllers) => {
    selfCtrl = controllers;
  }
}

// in Directive Controller
class ComboBoxDController {
  public selectedItem: string;
  public allItems: Array<string>;
  public isFocus: boolean;

  public showItems() {
    this.isFocus = true;
  }

  public selectItem($event, item:string) {
    $event.preventDefault();
    $event.stopPropagation();
    scope.selectedItem = item;
    scope.isFocus = false;
  }

}

app.directive('refComboBox', () => new ComboBoxDirective());



/**
 * 夕日本 P.275~
 */
app.directive('comboBox', [function () {
  return {
    scope: {
      selectedItem: '=',
      allItems: '='
    },
    restrict: 'EA',
    transclude: true, // notification タグ内の値をng-transclude内に要素がappendされる
    replace: true, // trueの場合でもnotification タグの属性も引き継がれる
    template: '<div class="comboBox">' +
      '<input type="text" ng-model="selectedItem">' +
      '<ul ng-show="isFocus">' +
      '<li ng-repeat="item in allItems" ng-click="click($event, item)">' +
      '{{item}}' + 
      '</li>' +
      '</ul>' +
      '</div>',
    link: function(scope: any, iElement) {
      scope.isFocus = false;

      iElement.find('input').on('focus', function() {
        scope.$apply(function() {
          scope.isFocus = true;
        });
      });

      scope.click = function($event, item) {
        $event.preventDefault();
        $event.stopPropagation();
        scope.selectedItem = item;
        scope.isFocus = false;
      }
    }
  };
}]);


/**
 * 夕日本 P.277~
 */
class NotificationController {
  message;
  items = [];
  addMessage(msg) {
    this.items.push({
      message: msg,
      enableMessage: true,
      time: new Date()
    });
  }
}

app
  .controller('notificationController', NotificationController)
  .directive('notification', ['$timeout', function ($timeout) {
    return {
      scope: {
        enable: '=',
        timeout: '='
      },
      restrict: 'E',
      transclude: true,
      template: '<div ng-show="enable" class="notification">' +
      '<a href="" ng-click="close()">閉じる</a>' + 
      '<div ng-transclude></div>' +
      '</div>',
      // templateUrl:
      // templateCacheServiceにhtmlデータ問い合わせ、なければxhrでアクセスする

      link: function(scope) {
        scope.close = function() {
          scope.enable = false;
        }
        var promise;
        scope.$watch('enable', function(newVal) {
          if (newVal) {
            promise = $timeout(function() {
            /*             
             scope.$apply(function() {
               scope.close();
             })
            */
             scope.close();
            }, scope.timeout);
          } else {
            if (promise) {
              $timeout.cancel(promise);
              promise = null;
            }
          }
        });
      }
    };
  }]);


/**
 *夕日本 P.279
 */
app.directive('rating', [function () {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      max: '=',
      readonly: '='
    },
    link: function (scope, element, attrs, ngModelCtrl) {
      // 1. scopeの値が変化したら再描画
      ngModelCtrl.$render = function() {
        updateRate(ngModelCtrl.$viewValue);
      }

      // 2. ngModel に バインドされた値に応じて星を描画
      function updateRate(rate) {
        angular.forEach(element.children(), function(child){
          angular.element(child).off('click'); // メモリリーク対策
        });
        element.empty();

        for (var i = 0; i < scope.max; i++) {
          var span = angular.element('<span></span>');
          var star = i < rate ? '★' : '☆'; // 黒星 + 白星
          span.text(star);

          // 3. 編集可能な場合の処理
          if (!scope.readonly) {
            span.addClass('changeable');
            (function() {
              console.log(i);
              var count = i + 1;
              span.on('click', function() {
                // クリックされた場所に応じて星の数を再描画
                scope.$apply(function() {
                  ngModelCtrl.$setViewValue(count);
                  updateRate(count);
                });
              });
            })();
          }
          element.append(span);
        }

      }

      // scopeの値が範囲外だった場合は、範囲内におさまるように変換する
      ngModelCtrl.$formatters.push(function(rate) {
        if (rate < 0) {
          return 0;
        } else if (rate > scope.max) {
          return scope.max;
        } else {
          return rate;
        }
      });
    }
  };
}])