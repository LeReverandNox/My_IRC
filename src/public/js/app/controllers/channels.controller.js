/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Channels", ChannelsController);

    ChannelsController.$inject = ["$rootScope", "$scope"];

    function ChannelsController($rootScope, $scope) {
        var C = this;
        var I = $scope.I;

        C.title = "Channels";
        C.channels = I.channels;

        $rootScope.$on("selfJoinChannel", function (e, data) {
            var channel = I.addChannel(data.channelName);
            C.switchChannel(channel);
            $rootScope.$emit("selfJoinChannelMessage", data);
        });

        $rootScope.$on("selfLeaveChannel", function (e, data) {
            var channel = I.removeChannel(data.channelName);
            if (channel.active && C.channels.length > 0) {
                C.switchChannel(C.channels[0]);
            } else {
                C.switchChannel();
            }
            $rootScope.$emit("selfLeftChannelMessage", data);
        });

        C.switchChannel = function (channel) {
            disableAllChannels();
            if (I.changeCurrentChannel(channel)) {
                channel.active = true;
            }
        };

        function disableAllChannels() {
            C.channels.forEach(function (channel) {
                if (channel.active) {
                    channel.active = false;
                }
            });
        }
    }
} ());