(function() {
    "use strict";
    angular.module('PageInfo')
        .controller('AppController', [
            '$scope',
            'Facebook',
            'FbService',
            'UtilService',
            'SaveCSV',
            AppController]);

    function AppController($scope, Facebook, FbService, UtilService, SaveCSV) {
        $scope.facebookReady        = false; // Facebook sdk ready status
        $scope.isLoggedIn           = false;
        $scope.username             = null;

        $scope.pages                = [];
        $scope.validPages           = [];
        $scope.pagesCount           = 0;
        $scope.validPagesCount      = 0;
        $scope.invalidPages         = [];
        $scope.invalidPagesCount    = 0;

        $scope.keywords             = [];
        $scope.finishedKeywords     = [];

       // App State
         $scope.queryStart          = false; // True when start pulling result from facebook
         $scope.queryFinished       = false; // True when all result has been returned from facebook
         $scope.validationStart     = false; // True when validation start with predefined rules
         $scope.validationFinished  = false; // True when validation finished
         $scope.saveStart           = false;
         $scope.saveFinished        = false;
         $scope.showPagination      = false;


        $scope.shouldStop           = false;
        // Settings
        var defaultSettings = {
            minLikes: 4000,
            requestInterval: 5000,
            filename: new Date().getTime(),
            categories: [
                'website', 'athlete', 'community', 'public figure',
                'blogger', 'author', 'chef', 'business person',
                'coach', 'dancer', 'designer', 'entertainer',
                'entrepreneur', 'health/beauty', 'health/wellness website',
                'local business', 'personal trainer', 'nutritionist',
                'professional services', 'fitness center', 'lifestyle services',
                'personal coaching', 'sports instruction', 'physical fitness'
            ]
        };
        $scope.settings = {};
        //$scope.minLikes             = 5000;
        //$scope.autoPull             = 'off';
        //$scope.requestInterval      = 5000; // 5 second

        $scope.fblogin = function() {
            FbService.login()
                .then(function(response) {
                   if(response.status == 'connected') {
                       $scope.isLoggedIn = true;
                   }
                });
        };
        $scope.fblogout = function() {
            FbService.logout()
                .then(function(response) {
                    $scope.isLoggedIn = false;
                });
        };

        /**
         * Initialize the search keyword by converting to array of keywords and call the search method.
         * @param keyword {String}
         */
        $scope.initializeSearch = function(keyword) {
            if(!keyword) {
                alert('Please enter a keyword first.');
                return;
            }
            reset();
            var strimKeyword = UtilService.strim(keyword);
            $scope.keywords = strimKeyword.split(',');
            searchPage();
        };

        /**
         * Check if there is any keyword on the list to search. If there is keyword then search
         * for the keyword. Return false if there is no keyword left to search.
         */
        function searchPage() {
            if($scope.keywords.length < 1) {
                $scope.queryFinished = true;
                $scope.shouldStop = true;
                $scope.queryStart = false;
                return false;
            }
            var newKeyword = UtilService.strim($scope.keywords.splice(0,1).join());
            $scope.finishedKeywords.push(newKeyword);

               $scope.queryStart = true;
               $scope.queryFinished = false;
               FbService.searchPage(newKeyword)
                   .then(function(data) {
                       var data = data['data'];
                       $scope.showPagination = true;
                       addPages(data);
                   });
        }

        $scope.stopQuery = function() {
            $scope.shouldStop = true;
            $scope.queryFinished = true;
            $scope.queryStart = false;
            return true;
        };

         //check user Facebook login status. If the user is logged into app,
         //Get the user name and set to the '$scope'
        var status = FbService.getLoginStatus();
        status.then(function(response) {
            if(response === 'true') {
                $scope.isLoggedIn = true;
                FbService.getFbName()
                    .then(function(name) {
                        $scope.username = name;
                    });
            }
        });

        // Watch for Facebook SDK ready state
        $scope.$watch(function() {
            return Facebook.isReady();
        }, function(newVal) {
            if(newVal) {
                $scope.facebookReady = true;
            }
        });
        $scope.$watch('queryFinished', function() {
            if($scope.queryFinished) {
                $scope.validationStart = true;
                validate($scope.pages);
            }
        });
        $scope.$watch('validationFinished', function() {
            if($scope.validationFinished) {
                $scope.saveStart = true;
                if(!$scope.validPages.length >= 1) {
                    alert('No valid page found!');
                    reset();
                    return;
                }
                saveToCSV();
            }
        });

        $scope.addCategory = function(newCategory) {
            var stc = UtilService.strim(newCategory);
            var index = $scope.settings.categories.indexOf(stc);
            if(index >= 0) {
                alert('You can not add duplicate category.');
            }else {
                $scope.settings.categories.push(newCategory);
                saveSettings();
            }
        };

        $scope.removeCategory = function(category) {
            var catg = UtilService.strim(category);
            var categories = $scope.settings.categories;

            for(var i = 0; i < categories.length; i++) {
                if(UtilService.strim(categories[i]) == catg ) {
                   $scope.settings.categories.splice(i, 1);
                    saveSettings();
                }
            }
        };


        /**
         * Strip whitespaces from string and covert to lowercase
         * @param string
         * @returns {string}
         */
        function getSettings() {
            var settignsPromise = UtilService.getSettings();
            settignsPromise.then(function(response) {
               if(response == 'false') {
                    $scope.settings = defaultSettings;
               }else {
                    $scope.settings = response;
               }
            });
        }
        function saveSettings() {
            UtilService.saveSettings($scope.settings);
        }
        function incrementCounter() {
            $scope.pagesCount = $scope.pages.length;
            $scope.validPagesCount = $scope.validPages.length;
        }
        function addPages(pages) {
            // If pages is empty, call the searchPage method to search with new keyword
            if(!pages) {
                searchPage();
                return;
            }

            $scope.pages = $scope.pages.concat(pages);
            incrementCounter();
            // If use doesn't stop the loop, make next request.
            // Otherwise set queryFinished to True and return false
            if(!$scope.shouldStop) {
                setTimeout(function() {
                    FbService.getNextPage()
                        .then(function(response) {
                            addPages(response['data']);
                        });
                }, $scope.settings.requestInterval);
            }else {
                $scope.queryFinished = true;
                $scope.queryStart = false;
                return false;
            }
        }

        function validate(pages) {
            UtilService.validate(pages, $scope.settings)
                .then(function(response) {
                    $scope.validPages           = response.valid;
                    $scope.validPagesCount      = response.valid.length;
                    $scope.invalidPages         = response.invalid;
                    $scope.invalidPagesCount    = response.invalid.length;
                    $scope.validationFinished   = true;
                    $scope.validationStart      = false;
                });
        }
        function saveToCSV() {
            if($scope.validPages.length <= 0 ) {
                $scope.saveFinished = true;
                return false;
            }
            var validPages = $scope.validPages.splice(0, 100);
            SaveCSV.saveToCSV(validPages, $scope.settings.filename, $scope.finishedKeywords)
                .then(function(res) {
                    saveToCSV();
                });
        }

        function reset() {
            $scope.pages                = [];
            $scope.validPages           = [];
            $scope.pagesCount           = 0;
            $scope.validPagesCount      = 0;
            $scope.invalidPages         = [];
            $scope.invalidPagesCount    = 0;
            $scope.keywords             = [];
            $scope.finishedKeywords     = [];
            // App State
            $scope.queryStart          = false;
            $scope.queryFinished       = false;
            $scope.validationStart     = false;
            $scope.validationFinished  = false;
            $scope.saveStart           = false;
            $scope.saveFinished        = false;
            $scope.showPagination      = false;
            $scope.shouldStop           = false;
        }
        getSettings();

    }



}());
