/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("commandsParserService", commandsParserService);

    commandsParserService.$inject = ["$rootScope", "commandsService"];

    function commandsParserService($rootScope, commandsService) {
        var service = {
            go: go,
            parse: parse,
            decide: decide
        };

        return service;

        function go(string, currChannelName) {
            string = string.trim();
            var results = this.parse(string);
            this.decide(results.cmd, results.arg1, results.arg2, currChannelName);
        }

        function parse(string) {
            var results = [];
            var cmd, arg1, arg2;

            if (string.match(/^\//)) {
                var cmdMatches = string.match(/^\/([a-zA-Z0-9]*)/);
                cmd = cmdMatches ? cmdMatches[1] : "";

                var arg1Matches = string.match(/\s(.[^\s]*)/);
                arg1 = arg1Matches ? arg1Matches[1] : "";

                var arg2Matches = string.match(/^(?:[^\s]*\s){2}(.*)/);
                arg2= arg2Matches ? arg2Matches[1] : "";
            } else {
                cmd = null;
                arg1 = string;
                arg2 = "";
            }

            return {
                cmd: cmd,
                arg1: arg1,
                arg2: arg2
            };
        }

        function decide(cmd, arg1, arg2, currChannelName) {
            switch (cmd) {
            case null:
                commandsService.sendMessage(currChannelName, arg1);
                break;
            case "join":
                commandsService.joinChannel(arg1);
                break;
            case "leave":
                commandsService.leaveChannel(arg1 || currChannelName);
                break;
            case "nick":
                commandsService.changeNickname(arg1);
                break;
            case "users":
                commandsService.listChannelUsers(arg1 || currChannelName);
                break;
            case "list":
                commandsService.listChannels(arg1);
                break;
            case "msg":
                commandsService.sendPrivateMessage(arg1, arg2);
                break;
            case "help":
                commandsService.listCommands();
                break;
            case "giphy":
                commandsService.randomGiphy(currChannelName, arg1.concat(" ", arg2));
                break;
            case "me":
                commandsService.meAction(currChannelName, arg1.concat(" ", arg2));
                break;
            case "ame":
                commandsService.ameAction(arg1.concat(" ", arg2));
                break;
            case "amsg":
                commandsService.sendMessageAll(arg1.concat(" ", arg2));
                break;
            default:
                $rootScope.$emit("unknowCommand", { error: true, nickname: "", message: "Unknown command, please refer to /help.", timestamp: new Date().getTime() });
                break;
            }
        }
    }
} ());