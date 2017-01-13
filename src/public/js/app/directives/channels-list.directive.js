/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .directive("channelsList", channelsListDirective);

    function channelsListDirective() {
        var directive = {
            restrict: "EA",
            link: link,
            templateUrl: "/partials/channels-list.html",
            controller: "Channels",
            controllerAs: "C",
            bindToController: true
        };

        return directive;

        function link(scope, element, attr) {
        }
    }
} ());