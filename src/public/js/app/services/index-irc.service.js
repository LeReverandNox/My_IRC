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
            changeNickname: changeNickname
        };

        function changeNickname(nickname, cb) {
            socketService.emit("changeNickname", nickname, cb);
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