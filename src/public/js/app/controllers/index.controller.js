/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Index", IndexController);

    IndexController.$inject = ["$rootScope", "indexIrcService"];

    function IndexController($rootScope, indexIrcService) {
        var I = this;

        I.title = "My_IRC";
        I.channels = [];
        I.currChannel = null;

        I.addChannel = function (channelName) {
            var channel = {
                name: channelName,
                users: [],
                messages: [],
                active: false
            };
            I.channels.push(channel);
            return channel;
        };

        I.removeChannel = function (channelName) {
            var channelIndex = I.channels.findIndex(function (channel) {
                return channel.name === channelName;
            });

            return I.channels.splice(channelIndex, 1)[0];
        };

        I.changeCurrentChannel = function (channel) {
            if (!channel) {
                I.currChannel = null;
            } else {
                I.currChannel = channel;
            }
            return I.currChannel;
        };

        I.getChannelByName = function (channelName) {
            var channel = I.channels.filter(function (channel) {
                return channel.name === channelName;
            })[0];
            return channel;
        };

        I.message = "";
        I.nickname = "";

        $rootScope.$on("handshake", function (e, data) {
            I.message = data.message;
            I.nickname = data.nickname;
        });
    }
}());