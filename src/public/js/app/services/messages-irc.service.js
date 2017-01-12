/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("messagesIrcService", messagesIrcService);

    messagesIrcService.$inject = ["socketService", "$rootScope"];

    function messagesIrcService(socketService, $rootScope) {
        var service = {
            sendPrivateMessage: sendPrivateMessage,
            sendMessage: sendMessage
        };

        function sendPrivateMessage(to, content, cb) {
            socketService.emit("sendPrivateMessage", to, content, cb);
        }

        function sendMessage(channel, content, cb) {
            socketService.emit("sendMessage", channel, content, cb);
        }

        socketService.on("receivePrivateMessage", function (data) {
            $rootScope.$emit("receivePrivateMessage", data);
        });

        socketService.on("receiveMessage", function (data) {
            $rootScope.$emit("receiveMessage", data);
        })

        return service;
    }
}());