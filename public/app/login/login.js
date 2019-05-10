/* jshint -W032 */ ;
! function() {
    'use strict';

    angular.module('app.home', [])

    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    views: {
                        '': {
                            templateUrl: 'app/login/login.tpl.html',
                            controller: 'loginCtrl'
                        }
                    }
                })
        }
    ]);

}();