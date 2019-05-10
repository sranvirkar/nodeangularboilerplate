/* jshint -W032 */ ;
! function() {
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngSanitize',
        'angularMoment',
        'angular-loading-bar',
        'app.APIServices',
        'app.home'
    ])

    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider',
        function($httpProvider, $stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/crickethome?cId=5008');

            // Intercept POST requests, convert to standard form encoding
            $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
                var key, result = [];
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                    }
                }
                return result.join("&");
            });
        }
    ])

    .constant('serviceBase', {
        apiBaseUri: "http://demo.eliteinfosoft.com:3000/nodeProxy/cricketJson/",
    })

    .run(['$rootScope', '$state',

        function($rootScope, $state) {

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            });

            $rootScope.$on('$stateChangeSuccess', function() {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });

        }
    ])

    .controller('appCtrl', ['$scope', '$location',
        function($scope, $location) {


        }
    ]);

}();