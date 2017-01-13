/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Channels", ChannelsController);

    ChannelsController.$inject = ["$rootScope", "channelsIrcService"];

    function ChannelsController($rootScope, channelsIrcService) {
        var C = this;

        C.title = "Channels";
        C.channels = [];

        $rootScope.$on("selfJoinChannel", function (e, channelName) {
            var channel = {
                name: channelName,
                active: false
            };
            C.channels.push(channel);
            C.switchChannel(channel);
        });

        $rootScope.$on("selfLeaveChannel", function (e, channelName) {
            var channelIndex = C.channels.findIndex(function (channel) {
                return channel.name === channelName;
            });
            var channel = C.channels[channelIndex];

            C.channels.splice(channelIndex, 1);
            $rootScope.$emit("selfRemoveChannel", channelName);

            if (channel.active && C.channels.length > 0) {
                C.switchChannel(C.channels[0]);
            } else {
                C.switchChannel();
            }
        });

        C.switchChannel = function (channel) {
            if (!channel) {
                channelsIrcService.activeChannel = null;
                $rootScope.$emit("selfSwitchChannel", null);
                return false;
            }
            disableAllChannels();
            channel.active = true;
            channelsIrcService.activeChannel = channel.name;
            $rootScope.$emit("selfSwitchChannel", channel.name);
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