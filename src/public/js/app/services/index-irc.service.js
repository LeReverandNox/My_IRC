/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("indexIrcService", indexIrcService);

    indexIrcService.$inject = ["socketService", "$rootScope"];

    function indexIrcService(socketService, $rootScope) {
        var service = {
            changeNickname: changeNickname,
            listCommands: listCommands,
            whois: whois,
            listServerUsers: listServerUsers
        };

        function changeNickname(nickname, cb) {
            socketService.emit("changeNickname", nickname, cb);
        }

        function listCommands(cb) {
            socketService.emit("listCommands", cb);
        }

        function whois(nickname, cb) {
            socketService.emit("whois", nickname, cb);
        }

        function listServerUsers(cb) {
            socketService.emit("listServerUsers", cb);
        }

        socketService.on("hasChangeNickname", function (data) {
            $rootScope.$emit("hasChangeNickname", data);
        });

        socketService.on("handshake", function (data) {
            $rootScope.$emit("handshake", data);
        });

        socketService.on("disconnect", function () {
            $rootScope.$emit("disconnect");
        });

        return service;
    }
}());