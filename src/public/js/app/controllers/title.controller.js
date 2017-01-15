/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Title", TitleController);

    TitleController.$inject = ["$rootScope"];

    function TitleController($rootScope) {
        var T = this;

        T.appTitle = "My_IRC";
        T.unreadCount = 0;

        $rootScope.$on("updateAppTitle", function (e, title) {
            T.appTitle = title;
        });

        $rootScope.$on("updateUnreadCount", function (e, count) {
            T.unreadCount = count;
            // $rootScope.$apply();
        });
    }
} ());