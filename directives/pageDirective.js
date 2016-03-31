(function() {
  "use strict";
  angular.module('PageInfo')
    .directive('page', function() {
      return {
        restrict: 'E',
        scope: {
          page: '='
        },
        templateUrl: 'directives/templates/page.html'
      };
    });
}());
