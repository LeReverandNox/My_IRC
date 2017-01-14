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
            sendMessage: sendMessage
        };

        return service;

        function joinChannel (channel) {
            return channelsIrcService.joinChannel(channel, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfJoinChannelMessage", res);
                }
                return $rootScope.$emit("selfJoinChannel", res);
            });
        }

        function leaveChannel (channel) {
            return channelsIrcService.leaveChannel(channel, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfLeftChannelMessage", res);
                }
                return $rootScope.$emit("selfLeaveChannel", res);
            });
        }

        function changeNickname (nickname) {
            return indexIrcService.changeNickname(nickname, function (res) {
                return $rootScope.$emit("selfChangeNickname", res);
            });
        }

        function listChannelUsers (channel) {
            return channelsIrcService.listChannelUsers(channel, function (res) {
                return $rootScope.$emit("listChannelUsers", res);
            });
        }

        function listChannels (string) {
            return channelsIrcService.listChannels(string, function (res) {
                return $rootScope.$emit("listChannels", res);
            });
        }

        function sendPrivateMessage (to, content) {
            return messagesIrcService.sendPrivateMessage(to, content, function (res) {
                return $rootScope.$emit("selfPrivateMessageSent", res);
            });
        }

        function sendMessage (channel, content) {
            return messagesIrcService.sendMessage(channel, content, function (res) {
                if (res.error) {
                    return $rootScope.$emit("selfMessageSent", res);
                }
            });
        }
    }
} ());