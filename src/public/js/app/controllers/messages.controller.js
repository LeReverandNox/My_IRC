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

        function displayMessage(e, data) {
            console.log("On va display ca", data);
            var formattedMessage = formatterService.format(data);
            addMessage(formattedMessage, data.channel);
        }

        function addMessage(message, channelName) {
            if (channelName) {
            var channel = I.getChannelByName(channelName);
            channel.messages.push(message);
            } else {
                I.currChannel.messages.push(message);
            }
        }

    }
} ());