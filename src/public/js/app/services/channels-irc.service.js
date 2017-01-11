/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("channelsIrcService", channelsIrcService);

    channelsIrcService.$inject = ["socketService", "$rootScope"];

    function channelsIrcService(socketService, $rootScope) {
        var service = {
            joinChannel: joinChannel
        };

        function joinChannel(channel, cb) {
            socketService.emit("joinChannel", channel, cb);
        }

        socketService.on("userJoinChannel", function (data) {
            $rootScope.$emit("userJoinChannel", data);
        });

        return service;
    }
} ());