(function() {
    "use strict";
    angular.module('PageInfo')
        .factory('UtilService', ['$q', Util]);

    function Util($q) {

        var settings = null;

        /**
         * Get the settings from localStorage. If no settings found, return false,
         * otherwise return settigns object
         * @returns {promise <Object>}
         */
        function getSettings() {
            var deferred = $q.defer();
            var localSettings = localStorage.getItem('fextract');
            if(localSettings == 'undefined' || localSettings == null) {
                deferred.resolve('false');
            }else {
                var settings = JSON.parse(localSettings);
                deferred.resolve(settings);
            }

            return deferred.promise;
        }

        /**
         * Save application settings object to localStorage
         * @param settings {Object}
         * @returns {boolean}
         */
        function saveSettings(settings) {
            var strSettings = JSON.stringify(settings);
            localStorage.setItem('fextract', strSettings);
            return true;
        }

        function validate(pages, rules) {
            settings = rules;
            var minLikes = rules.minLikes;
            var deferred = $q.defer(),
                validPages  = [],
                invalidPages = [];
            var lnth = pages.length;
            for(var i = 0; i < lnth; i++) {
                var page = pages[i];
                if(isValidCategory(page) && page.likes >= minLikes) {
                   try {
                        if(page.website == undefined) {
                            page.website = 'No Website';
                        }
                        if(page.emails == undefined) {
                            page.emails = ['No Email'];
                        }
                       validPages.push(page);
                   }catch (err) {
                       page.website = 'No Website';
                       page.emails = ['No Email'];
                   }
                }else {
                    invalidPages.push(page);
                }

                if(i == (lnth - 1)) {
                    deferred.resolve({valid: validPages, invalid: invalidPages});
                }
            }
            return deferred.promise;
        }

        function isValidCategory(page) {
            var validCategories = settings.categories;
            if(validCategories.length <= 0) {
                return true;
            }
            try {
                var category = strim(page.category);
                if(validCategories.indexOf(category) >= 0) {
                    return true;
                }else {
                    return false;
                }
            }catch (err) {
                return false;
            }
        }

        /**
         * Remove trailing whitespaces from string and transform to lowercase
         * @param string
         * @returns {string}
         */
        function strim(string) {
            return string.replace(/\s+/g,' ').trim().toLowerCase();
        }






        return {
            getSettings: getSettings,
            saveSettings: saveSettings,
            validate: validate,
            strim: strim
        }
    }
}());