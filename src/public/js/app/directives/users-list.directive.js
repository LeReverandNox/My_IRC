/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .directive("usersList", usersListDirective);

    function usersListDirective() {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "/partials/users-list.html",
            controller: "Users",
            controllerAs: "U",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
        }
    }
} ());