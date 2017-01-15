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

        $rootScope.$on("selfJoinChannel", function (e, data) {
            var channel = I.addChannel(data.channelName);
            C.switchChannel(channel);
            $rootScope.$emit("selfJoinChannelMessage", data);
        });

        $rootScope.$on("selfLeaveChannel", function (e, data) {
            var channel = I.removeChannel(data.channelName);
            if (I.channels.length > 0) {
                if (channel.active) {
                    C.switchChannel(I.channels[0]);
                }
            } else {
                C.switchChannel();
            }
            $rootScope.$emit("selfLeftChannelMessage", data);
        });

        C.switchChannel = function (channel) {
            disableAllChannels();
            if (I.changeCurrentChannel(channel)) {
                channel.active = true;
                I.resetUnreadCount(channel.name);
            }
        };

        function disableAllChannels() {
            I.channels.forEach(function (channel) {
                if (channel.active) {
                    channel.active = false;
                }
            });
        }
    }
} ());