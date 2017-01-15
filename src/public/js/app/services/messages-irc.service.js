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
            sendMessage: sendMessage,
            randomGiphy: randomGiphy,
            meAction: meAction,
            ameAction: ameAction,
            sendMessageAll: sendMessageAll
        };

        function sendPrivateMessage(to, content, cb) {
            socketService.emit("sendPrivateMessage", to, content, cb);
        }

        function sendMessage(channel, content, cb) {
            socketService.emit("sendMessage", channel, content, cb);
        }

        function randomGiphy(channel, tag, cb) {
            socketService.emit("randomGiphy", channel, tag, cb);
        }

        function meAction(channel, action, cb) {
            socketService.emit("meAction", channel, action, cb);
        }

        function ameAction(action, cb) {
            socketService.emit("ameAction", action, cb);
        }

        function sendMessageAll(content, cb) {
            socketService.emit("sendMessageAll", content, cb);
        }

        socketService.on("receivePrivateMessage", function (data) {
            $rootScope.$emit("receivePrivateMessage", data);
        });

        socketService.on("receiveMessage", function (data) {
            $rootScope.$emit("receiveMessage", data);
        });

        return service;
    }
}());