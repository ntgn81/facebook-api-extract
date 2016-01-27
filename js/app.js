(function() {
    "use strict";
    angular.module('PageInfo', ['facebook'])
        .config(['FacebookProvider', function(FacebookProvider) {
            FacebookProvider.init('1479021652314557');
        }]);


}());