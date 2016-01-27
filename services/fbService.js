(function() {
    "use strict";
    angular.module('PageInfo')
        .factory('FbService', ['Facebook', '$q', FbService]);


    function FbService(Facebook, $q) {

        var fbQuery = {};

        fbQuery.limit = 300;
        fbQuery.offset = 0;
        fbQuery.followLink = undefined;

        /**
         * Check user app login status. If connected to app return an object
         * with connect status, user id and access token. If not connected
         * return false
         *
         * @returns {promise <Boolean>}
         */
        fbQuery.getLoginStatus =  function() {
            var deferred = $q.defer();

            Facebook.getLoginStatus(function(response) {
               if(response.status === 'connected') {
                   var uid = response.authResponse.userID;
                   var access_token = response.authResponse.accessToken;
                   deferred.resolve('true');
               }else {
                   deferred.resolve('false');
               }
            });
            return deferred.promise;
        };


        /**
         * Login with Facebook
         * @returns {promise <Object>}
         */
        fbQuery.login = function() {
            var deferred = $q.defer();
            Facebook.login(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        /**
         * Facebook logout
         * @returns {promise <object>}
         */
        fbQuery.logout = function() {
            var deferred = $q.defer();
              Facebook.logout(function(response) {
                  deferred.resolve(response);
              });
            return deferred.promise;
        };

        /**
         * Get user facebook full name.
         * @returns {promise <String>}
         */
        fbQuery.getFbName = function() {
            var deferred = $q.defer();

            Facebook.api('/me', function(response) {
               deferred.resolve(response.name);
            });
            return deferred.promise;
        };

        /**
         * Get girst page of resutls for the provided keyword.
         * If Facebook return a next page link, save the link for next query
         *
         * @param keyword {String}
         * @returns {promise <object>}
         */
        fbQuery.searchPage = function(keyword) {
            var deferred = $q.defer();
            Facebook.api('/search?type=page&q=' + keyword + '&fields=id,name,likes,website,category,emails,link,cover' + '&limit=' + fbQuery.limit + '&offset=' + fbQuery.offset , function(response) {
                try {
                    var link = response['paging'].next;
                   fbQuery.followLink = link;
                }catch (err) {
                   fbQuery.followLink = undefined;
                }
                deferred.resolve(response);
            });
            return deferred.promise;
        };

          /**
         * Get the next page of results from facebook. If there is next page link, save for the next query.
         * If the previous next page link is null, immediately return false.
         *
         * @returns {*} If next page link is null, immediately return false, otherwise return a promise
         */
        fbQuery.getNextPage = function() {
            var deferred = $q.defer();
            if(fbQuery.followLink == undefined) {
                deferred.resolve('false');
            }else {
                Facebook.api(fbQuery.followLink, function(response) {
                    try {
                        var link = response['paging'].next;
                        fbQuery.followLink = link;
                    }catch (err) {
                        fbQuery.followLink = undefined;
                    }
                    deferred.resolve(response);
                });
            }
            return deferred.promise;
        };

        return fbQuery;
    }

}());