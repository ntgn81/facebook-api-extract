(function(jQuery) {
    "use strict";
    angular.module('PageInfo')
        .factory('SaveCSV', ['$q',SaveCSV]);

    function SaveCSV($q) {

        function saveToCSV(data, filename) {
            var deferred = $q.defer();
            jQuery.ajax({
                url: 'include/saveToCsv.php',
                method: 'post',
                data: {
                    pages: JSON.stringify(data),
                    filename: JSON.stringify(filename)
                },
                success: function(res) {
                    deferred.resolve('true');
                }
            });
            return deferred.promise;
        }

        return {
            saveToCSV: saveToCSV
        }
    }
}(jQuery));