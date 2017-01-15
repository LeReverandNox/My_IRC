/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Messages", MessagesController);

    MessagesController.$inject = ["$rootScope", "$scope", "formatterService"];

    function MessagesController($rootScope, $scope, formatterService) {
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
                    channel.unreadCount += 1;
                }
            } else {
                I.currChannel.messages.push(message);
            }
        }

    }
} ());