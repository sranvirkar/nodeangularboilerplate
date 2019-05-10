! function() {
    angular.module('app.APIServices', []).
    factory('API', ['$http', 'serviceBase',
        function($http, serviceBase) {
            return {
                GetContacts: function() {
                    return $http({
                        url: serviceBase.apiBaseUri + 'GetFullSeriesList',
                        method: 'POST',
                        data: {
                            clientId: 82
                        },
                        cache: false
                    }).then(function(response) {
                        return response.data;
                    });
                }
            }
        }
    ]);
}();