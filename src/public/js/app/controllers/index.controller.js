/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Index", IndexController);

    IndexController.$inject = ["$rootScope", "indexIrcService"];

    function IndexController($rootScope, indexIrcService) {
        var I = this;
        I.title = "My_IRC";
        I.message = "";

        $rootScope.$on("handshake", function (e, data) {
            I.message = data;
        });
    }
}());