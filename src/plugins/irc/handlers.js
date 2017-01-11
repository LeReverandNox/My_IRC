/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var tools = require("./lib/tools");

var handlers = function (server, ircService) {
    return {
        handleNewUser: function (socket) {
            console.log("Here's a new connection");

            var baseNickname = tools.generateNickname();
            var nickname = baseNickname + tools.generateHash();
            while (ircService.isNicknameTaken(nickname)) {
                nickname = baseNickname + tools.generateHash();
            }

            var user = ircService.addUser(nickname, socket);

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

                socket.broadcast.to(channel).emit("userJoinChannel", {
                    nickname: "SERVER",
                    message: `${user.nickname} join the channel [${channel}]`
                });
                return cb(`You join the channel ${channel}`);
            });
        },
        disconnect: function () {
            console.log("Bye bye !");
            ircService.removeUser(this);
        }
    };
};

module.exports = handlers;