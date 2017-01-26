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
            controllerAs: "Co",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
            var input = element[0].querySelector('textarea');
            input.focus();

            element.bind("keydown keypress", function (event) {
                if (event.keyCode === 27) {
                    scope.$apply(function () {
                        scope.Co.command = "";
                    });
                    event.preventDefault();
                }
            });
        }
    }
} ());