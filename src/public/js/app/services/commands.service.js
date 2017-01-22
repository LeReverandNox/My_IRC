/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("commandsService", commandsService);

    commandsService.$inject = ["$rootScope", "indexIrcService", "channelsIrcService", "messagesIrcService"];

    function commandsService($rootScope, indexIrcService, channelsIrcService, messagesIrcService) {
        var service = {
            joinChannel: joinChannel,
            leaveChannel: leaveChannel,
            changeNickname: changeNickname,
            listChannelUsers: listChannelUsers,
            listChannels: listChannels,
            sendPrivateMessage: sendPrivateMessage,
            sendMessage: sendMessage,
            listCommands: listCommands,
            randomGiphy: randomGiphy,
            meAction: meAction,
            ameAction: ameAction,
            sendMessageAll: sendMessageAll,
            whois: whois,
            listServerUsers: listServerUsers,
            getUptime: getUptime
        };

        return service;

        function joinChannel(channel) {
            return channelsIrcService.joinChannel(channel, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfJoinChannelMessage", res);
                }
                return $rootScope.$emit("selfJoinChannel", res);
            });
        }

        function leaveChannel(channel) {
            return channelsIrcService.leaveChannel(channel, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfLeftChannelMessage", res);
                }
                return $rootScope.$emit("selfLeaveChannel", res);
            });
        }

        function changeNickname(nickname) {
            return indexIrcService.changeNickname(nickname, function (res) {
                return $rootScope.$emit("selfChangeNickname", res);
            });
        }

        function listChannelUsers(channel) {
            return channelsIrcService.listChannelUsers(channel, function (res) {
                return $rootScope.$emit("listChannelUsers", res);
            });
        }

        function listChannels(string) {
            return channelsIrcService.listChannels(string, function (res) {
                return $rootScope.$emit("listChannels", res);
            });
        }

        function sendPrivateMessage(to, content) {
            return messagesIrcService.sendPrivateMessage(to, content, function (res) {
                return $rootScope.$emit("selfPrivateMessageSent", res);
            });
        }

        function sendMessage(channel, content) {
            return messagesIrcService.sendMessage(channel, content, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfMessageSent", res);
                }
            });
        }

        function listCommands() {
            return indexIrcService.listCommands(function (res) {
                return $rootScope.$emit("listCommands", res);
            });
        }

        function randomGiphy(channel, tag) {
            return messagesIrcService.randomGiphy(channel, tag, function (res) {
                if (res.error) {
                    return $rootScope.$emit("giphyError", res);
                }
            });
        }

        function meAction(channel, action) {
            return messagesIrcService.meAction(channel, action, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfMeAction", res);
                }
            });
        }

        function ameAction(action) {
            return messagesIrcService.ameAction(action, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfAmeAction", res);
                }
            });
        }

        function sendMessageAll(content) {
            return messagesIrcService.sendMessageAll(content, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfMessageAllSent", res);
                }
            });
        }

        function whois(nickname) {
            return indexIrcService.whois(nickname, function (res) {
                return $rootScope.$emit("whois", res);
            });
        }

        function listServerUsers() {
            return indexIrcService.listServerUsers(function (res) {
                return $rootScope.$emit("listServerUsers", res);
            });
        }

        function getUptime() {
            return indexIrcService.getUptime(function (res) {
                return $rootScope.$emit("getUptime", res);
            });
        }
    }
} ());