(function() {
  "use strict";
  angular.module('PageInfo')
    .directive('page', function() {
      return {
        restrict: 'E',
        scope: {
          page: '='
        },
        templateUrl: 'app/directives/templates/page.html'
      };
    });
}());
