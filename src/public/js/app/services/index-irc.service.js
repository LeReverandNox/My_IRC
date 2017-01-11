/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("indexIrcService", indexIrcService);

    indexIrcService.$inject = ["socketService", "$rootScope"];

    function indexIrcService(socketService, $rootScope) {
        var service = {};

        socketService.on("handshake", function (data) {
            $rootScope.$emit("handshake", data);
        });

        return service;
    }
}());