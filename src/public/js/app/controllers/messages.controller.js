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

        $rootScope.$on("userJoinChannel", displayMessage);
        $rootScope.$on("userLeftChannel", displayMessage);
        $rootScope.$on("hasChangeNickname", displayMessage);
        $rootScope.$on("receivePrivateMessage", displayMessage);
        $rootScope.$on("receiveMessage", displayMessage);
        $rootScope.$on("listChannelUsers", displayMessage);
        $rootScope.$on("listChannels", displayMessage);
        $rootScope.$on("selfChangeNickname", displayMessage);

        function displayMessage(e, data) {
            console.log("On va display ca", data);
            var formattedMessage = formatterService.format(data);
            addMessage(formattedMessage);
        }

        function addMessage(message) {
            I.currChannel.messages.push(message);
            console.log(I.currChannel.messages);
        }

    }
} ());