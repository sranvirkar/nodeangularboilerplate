/* jshint -W032 */ ;
! function() {
    'use strict';

    angular.module('app.home', [])

    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    views: {
                        '': {
                            templateUrl: 'app/home/home.tpl.html',
                            controller: 'homeCtrl'
                        },
                        'details@home': {
                            templateUrl: function($stateParams) {
                                if ($stateParams.ct) {
                                    switch ($stateParams.ct) {
                                        case 'activeConversation':
                                            return 'app/homeDetails/activeConversation.tpl.html';
                                            break;
                                        case 'recentActiveContact':
                                            return 'app/homeDetails/recentActiveContact.tpl.html';
                                            break;
                                        default:
                                            return 'app/homeDetails/activeContactsOfWeek.tpl.html';
                                    }
                                }
                            },
                            controllerProvider: function($stateParams) {
                                if ($stateParams.ct) {
                                    switch ($stateParams.ct) {
                                        case 'ip':
                                            return 'activeConversationCtrl';
                                            break;
                                        case 'c':
                                            return 'recentActiveContactCtrl';
                                            break;
                                        default:
                                            return 'activeContactsOfWeekCtrl';
                                    }
                                }
                            }
                        }
                    }
                })
        }
    ]);

}();