/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Index", IndexController);

    IndexController.$inject = ["$rootScope", "$window"];

    function IndexController($rootScope, $window) {
        var I = this;

        I.title = "My_IRC";
        I.focus = true;
        I.message = null;
        I.nickname = null;

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

        I.incUnreadCount = function (channel) {
            channel.unreadCount += 1;
            I.updateUnreadCount();
        };

        I.resetUnreadCount = function (channel) {
            channel.unreadCount = 0;
            I.updateUnreadCount();
        };

        I.updateUnreadCount = function () {
            var globalUnreadCount = 0;
            I.channels.forEach(function (channel) {
                globalUnreadCount += channel.unreadCount;
            });
            globalUnreadCount += I.personnalChannel.unreadCount;
            $rootScope.$emit("updateUnreadCount", globalUnreadCount);
        };

        function init() {
            I.channels = [];
            I.personnalChannel = {
                name: "Personnal Channel",
                messages: [],
                unreadCount: 0
            };
            I.currChannel = I.personnalChannel;

            I.message = null;
            I.nickname = null;
        }

        $rootScope.$on("handshake", function (e, data) {
            I.message = data.message;
            I.nickname = data.nickname;
        });

        $rootScope.$on("disconnect", function (e) {
            init();
        });

        $rootScope.$on("selfChangeNickname", function (e, data) {
            if (data.newNickname) {
                I.nickname = data.newNickname;
                I.message = I.message.replace(data.oldNickname, data.newNickname);
            }
        });

        $window.onfocus = function () {
            I.focus = true;
            I.resetUnreadCount(I.currChannel);
        };

        $window.onblur = function () {
            I.focus = false;
        };
    }
} ());