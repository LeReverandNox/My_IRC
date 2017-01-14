/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Commands", CommandsController);

    CommandsController.$inject = ["$rootScope", "$scope", "commandsParserService"];

    function CommandsController($rootScope, $scope, commandsParserService) {
        var Co = this;
        var I = $scope.I;

        Co.title = "Commands";
        Co.command = "";

        Co.submitCommand = function () {
            commandsParserService.go(Co.command, I.currChannel.name);
            Co.command = "";
        };
    }
} ());