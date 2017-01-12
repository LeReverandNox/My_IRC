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
            sendPrivateMessage: sendPrivateMessage
        };

        function sendPrivateMessage(to, content, cb) {
            socketService.emit("sendPrivateMessage", to, content, cb);
        }

        socketService.on("receivePrivateMessage", function (data) {
            $rootScope.$emit("receivePrivateMessage", data);
        });

        return service;
    }
}());