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

            channel = channel.trim() || "";
            if (!channel) {
                return cb("This channel name is too short !");
            }

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
        listChannelUsers: function (channel, cb) {
            if (!ircService.channelExist(channel)) {
                return cb({
                    message: "This channel doesn't exist !",
                    data: []
                });
            }

            var users = ircService.listChannelUsers(channel);
            return cb({
                message: `Here the user list for channel [${channel}]`,
                data: users
            });
        },
        listChannels: function (string, cb) {
            var channels = ircService.listChannels();
            var message = `Here's the channels list`;

            string = string.trim() || "";
            if (string) {
                message = message + ` containing ${string}`;
                channels = channels.filter(function (channel) {
                    return channel.includes(string);
                });
            }

            return cb({
                message: message,
                data: channels
            });
        },
        changeNickname: function (newNickname, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);
            var oldNickname = user.nickname;
            console.log(`L'user ${user.nickname} veut changer son nickname en ${newNickname}`);

            newNickname = newNickname.trim() || "";
            if (!newNickname) {
                return cb("This nickname is too short !");
            }

            ircService.changeUserNickname(user, newNickname, function (err, msg) {
                if (err) {
                    return cb(msg);
                }
                console.log(`${oldNickname} change is nickname to ${user.nickname} !`);

                user.channels.forEach(function (channel) {
                    socket.broadcast.to(channel).emit("hasChangeNickname", {
                        nickname: "SERVER",
                        message: `${oldNickname} change is nickname to ${user.nickname} !`
                    });
                });
                return cb(`You change your nickname from ${oldNickname} to ${user.nickname}`);
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