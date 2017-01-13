/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .directive("messagesList", messagesListDirective);

    function messagesListDirective() {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "/partials/messages-list.html",
            controller: "Messages",
            controllerAs: "M",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
        }
    }
} ());