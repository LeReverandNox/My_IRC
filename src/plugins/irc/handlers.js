/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var tools = require("./lib/tools");

var handlers = function (server, ircService) {
    return {
        handleNewUser: function (socket) {
            var baseNickname = tools.generateNickname();
            var nickname = baseNickname + tools.generateHash();
            while (ircService.isNicknameTaken(nickname)) {
                nickname = baseNickname + tools.generateHash();
            }

            var user = ircService.addUser(nickname, socket);
            console.log(`${user.nickname} join the server !`);
            return socket.emit("handshake", {
                message: `Welcome to you sir ${user.nickname}, to My_IRC ! Feel free to join a channel (/help)`,
                nickname: user.nickname
            });
        },
        joinChannel: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            ircService.joinChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb(msg);
                }
                console.log(`${user.nickname} join the channel ${channel} !`);

                socket.broadcast.to(channel).emit("userJoinChannel", {
                    nickname: "SERVER",
                    message: `${user.nickname} join the channel [${channel}]`
                });
                return cb(`You join the channel ${channel}`);
            });
        },
        leaveChannel: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            ircService.leaveChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb(msg);
                }
                console.log(`${user.nickname} left the channel ${channel} !`);

                socket.broadcast.to(channel).emit("userLeftChannel", {
                    nickname: "SERVER",
                    message: `${user.nickname} has left the channel [${channel}]`
                });
                return cb(`You left the channel ${channel}`);
            });
        },
        disconnect: function () {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);
            console.log(`${user.nickname} left the server !`);

            user.channels.forEach(function (channel) {
                ircService.leaveChannel(user, channel, function (err, msg) {
                    console.log(`${user.nickname} left the channel ${channel} !`);
                    socket.broadcast.to(channel).emit("userLeftChannel", {
                        nickname: "SERVER",
                        message: `${user.nickname} has left the channel [${channel}]`
                    });
                });
            });

            console.log(`${user.nickname} left the server !`);
            ircService.removeUser(user);
        }
    };
};

module.exports = handlers;