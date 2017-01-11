/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var tools = require("../lib/tools");

var ircService = function (server) {
    return {
        init: function () {
            console.log("On initialise le serveur IRC");

            server.irc = {};
            server.irc.users = [];
            server.irc.channels = [];

            return this;
        },
        addUser: function (nickname, socket) {
            var user = {
                nickname: nickname,
                socketId: socket.id,
                socket: socket,
                channels: []
            };
            server.irc.users.push(user);
            return user;
        },
        removeUser: function (user) {
            var index = this.getUserIndexBySocketId(user.socket.id);
            server.irc.users.splice(index, 1);
        },
        joinChannel: function (user, channel, cb) {
            if (user.socket.rooms[channel]) {
                return cb(true, "You already are a member of this channel.");
            }
            if (!this.channelExist(channel)) {
                this.addChannel(channel).users.push(user);
            }

            user.channels.push(channel);
            user.socket.join(channel);
            return cb(false, null);
        },
        leaveChannel: function (user, channel, cb) {
            if (!user.socket.rooms[channel]) {
                return cb(true, "You are not a member of this channel.");
            }

            user.channels.splice(user.channels.indexOf(channel), 1);
            user.socket.leave(channel);

            return cb(false, null);
        },
        addChannel: function (channel) {
            var channelObj = {
                name: channel,
                users: []
            };
            server.irc.channels[channel] = channelObj;
            return channelObj;
        },
        getUserBySocketId: function (socketId) {
            var user = server.irc.users.filter(function (user) {
                return user.socketId === socketId;
            })[0];
            return user;
        },
        channelExist: function (channel) {
            return server.irc.channels[channel] ? true : false;
        },
        getUserIndexBySocketId: function (socketId) {
            var index = server.irc.users.findIndex(function (user) {
                return user.socketId === socketId;
            });
            return index;
        },
        isNicknameTaken: function (nickname) {
            function checkNicknames (users) {
                return users.nickname === nickname;
            }
            return server.irc.users.filter(checkNicknames).length > 0 ? true : false;
        }
    };
};

module.exports = ircService;