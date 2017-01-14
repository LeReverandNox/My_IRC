/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .directive("commandsBox", commandsBoxDirective);

    function commandsBoxDirective() {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "/partials/commands-box.html",
            controller: "Commands",
            controllerAs: "C",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
        }
    }
} ());