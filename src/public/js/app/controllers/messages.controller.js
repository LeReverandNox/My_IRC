/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Messages", MessagesController);

    MessagesController.$inject = ["$rootScope", "$scope", "formatterService", "notificationsService"];

    function MessagesController($rootScope, $scope, formatterService, notificationsService) {
        var M = this;
        var I = $scope.I;

        M.title = "Messages";
        M.channels = I.channels;

        // In current channel
        $rootScope.$on("hasChangeNickname", displayMessage);
        $rootScope.$on("userJoinChannel", displayMessage);
        $rootScope.$on("userLeftChannel", displayMessage);
        $rootScope.$on("listChannelUsers", displayMessage);
        $rootScope.$on("receiveMessage", displayMessage);
        $rootScope.$on("selfJoinChannelMessage", displayMessage);

        // Out-off current channel
        $rootScope.$on("selfLeftChannelMessage", displayMessage);
        $rootScope.$on("selfChangeNickname", displayMessage);
        $rootScope.$on("listChannels", displayMessage);
        $rootScope.$on("selfPrivateMessageSent", displayMessage);
        $rootScope.$on("receivePrivateMessage", displayMessage);
        $rootScope.$on("selfMessageSent", displayMessage);
        $rootScope.$on("listCommands", displayMessage);
        $rootScope.$on("giphyError", displayMessage);
        $rootScope.$on("selfMeAction", displayMessage);
        $rootScope.$on("selfAmeAction", displayMessage);
        $rootScope.$on("selfMessageAllSent", displayMessage);
        $rootScope.$on("whois", displayMessage);
        $rootScope.$on("listServerUsers", displayMessage);
        $rootScope.$on("getUptime", displayMessage);
        $rootScope.$on("unknowCommand", displayMessage);

        function displayMessage(e, data) {
            var formattedMessage = formatterService.format(data);
            addMessage(formattedMessage, data.channel);
        }

        function addMessage(message, channelName) {
            if (channelName) {
                var channel = I.getChannelByName(channelName);
                channel.messages.push(message);
                if (channelName !== I.currChannel.name) {
                    I.incUnreadCount(channel);
                    if (message.nickname !== I.nickname) {
                        notificationsService.show(channelName, message);
                    }
                } else {
                    if (!I.focus) {
                        I.incUnreadCount(channel);
                        notificationsService.show(channelName, message);
                    }
                }
            } else {
                I.currChannel.messages.push(message);
                if (!I.focus) {
                    I.incUnreadCount(I.currChannel);
                    notificationsService.show(I.currChannel.name, message);
                }
            }
        }

    }
} ());