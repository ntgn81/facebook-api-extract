(function() {

  "use strict";

  angular.module('PageInfo', ['facebook'])

  .config(['FacebookProvider', function(FacebookProvider) {

    FacebookProvider.init('954791237944392');

    // app for testing
    // FacebookProvider.init('1774515672761626');

  }]);

}());
