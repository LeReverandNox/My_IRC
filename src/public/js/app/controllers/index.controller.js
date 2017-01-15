/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Index", IndexController);

    IndexController.$inject = ["$rootScope"];

    function IndexController($rootScope) {
        var I = this;

        I.title = "My_IRC";

        init();

        I.addChannel = function (channelName) {
            var channel = {
                name: channelName,
                users: [],
                messages: [],
                unreadCount: 0,
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
                I.currChannel = I.personnalChannel;
                return null;
            } else {
                I.currChannel = channel;
                return I.currChannel;
            }
        };

        I.getChannelByName = function (channelName) {
            var channel = I.channels.filter(function (channel) {
                return channel.name === channelName;
            })[0];
            return channel;
        };

        function init() {
            I.channels = [];
            I.personnalChannel = {
                messages: []
            };
            I.currChannel = I.personnalChannel;
        }

        $rootScope.$on("handshake", function (e, data) {
            I.message = data.message;
            I.nickname = data.nickname;
        });

        $rootScope.$on("disconnect", function (e) {
            init();
        });
    }
} ());