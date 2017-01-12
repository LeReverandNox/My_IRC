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
            joinChannel: joinChannel,
            leaveChannel: leaveChannel
        };

        function joinChannel(channel, cb) {
            socketService.emit("joinChannel", channel, cb);
        }
        function leaveChannel(channel, cb) {
            socketService.emit("leaveChannel", channel, cb);
        }

        socketService.on("userJoinChannel", function (data) {
            $rootScope.$emit("userJoinChannel", data);
        });

        socketService.on("userLeftChannel", function (data) {
            $rootScope.$emit("userLeftChannel", data);
        });

        return service;
    }
} ());