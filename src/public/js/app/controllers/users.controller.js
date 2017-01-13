/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Users", UsersController);

    UsersController.$inject = ["$rootScope", "channelsIrcService"];

    function UsersController($rootScope, channelsIrcService) {
        var U = this;

        U.title = "Users";
        U.channels = [];
        U.currChannel = {};

        $rootScope.$on("updateUsersInChannel", function (e, res) {
            var channelObj = getChannelByName(res.data.channel);
            if (!channelObj) {
                U.channels.push({
                    name: res.data.channel,
                    users: res.data.users
                });
            } else {
                channelObj.channel.users = res.data.users;
            }
        });

        $rootScope.$on("selfRemoveChannel", function (e, channelName) {
            var channelObj = getChannelByName(channelName);
            U.channels.splice(channelObj.index, 1);
        });


        $rootScope.$on("selfSwitchChannel", function (e, channelName) {
            var channel = getChannelByName(channelName);
            U.currChannel = channel.channel || {};
        });

        function getChannelByName (name) {
            var channelIndex = U.channels.findIndex(function (channel) {
                return channel.name === name;
            });

            if (channelIndex === -1) {
                return null;
            }
            var channel = U.channels[channelIndex];
            return {
                index: channelIndex,
                channel: channel
            }
        }
    }
} ());