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
        Co.commandHistory = [];
        Co.historyCursor = 0;

        Co.submitCommand = function () {
            commandsParserService.go(Co.command, I.currChannel.name);
            Co.command = "";
            Co.historyCursor = 0;
        };

        Co.keyCatcher = function ($event) {
            if ($event.keyCode === 38) {
                rewindHistory("up", $event);
            }
            if ($event.keyCode === 40) {
                rewindHistory("down", $event);
            }
        };

        $rootScope.$on("addToHistory", function (e, string) {
            addToHistory(string);
        });


        function rewindHistory(direction, e) {
            e.preventDefault();

            var cmd;
            switch (direction) {
            case "up":
                cmd = getPreviousCmd();
                break;
            case "down":
                cmd = getNextCmd();
                break;
            }
            Co.command = cmd;
        }

        function getPreviousCmd() {
            Co.historyCursor += 1;
            if (Co.historyCursor <= Co.commandHistory.length) {
                return Co.commandHistory[Co.historyCursor - 1];
            } else {
                Co.historyCursor -= 1;
                return Co.commandHistory[Co.historyCursor - 1];
            }
        }

        function getNextCmd() {
            Co.historyCursor -= 1;
            if (Co.historyCursor >= 0) {
                return Co.commandHistory[Co.historyCursor - 1];
            } else {
                Co.historyCursor += 1;
                return "";
            }
        }

        function addToHistory(cmd) {
            Co.commandHistory.unshift(cmd);
        }
    }
} ());