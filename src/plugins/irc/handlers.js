/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var tools = require("./lib/tools");

var handlers = function (server, ircService, io) {
    return {
        handleNewUser: function (socket) {
            var baseNickname = tools.generateNickname();
            var nickname = baseNickname + tools.generateHash();
            while (ircService.isNicknameTaken(nickname)) {
                nickname = baseNickname + tools.generateHash();
            }

            var user = ircService.addUser(nickname, socket);
            console.log(`[${tools.datetime()}] - ${user.nickname} join the server !`);
            return socket.emit("handshake", {
                message: `Welcome to you sir ${user.nickname}, to My_IRC ! Feel free to join a channel (/help)`,
                nickname: user.nickname,
                timestamp: tools.now()
            });
        },
        joinChannel: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            channel = channel.trim() || "";
            if (!channel) {
                return cb({ error: true, message: "This channel name is too short !", timestamp: tools.now() });
            }

            ircService.joinChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb({ error: true, message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${user.nickname} join the channel ${channel} !`);

                socket.broadcast.to(channel).emit("userJoinChannel", {
                    nickname: "SERVER",
                    message: `${user.nickname} join the channel [${channel}]`,
                    timestamp: tools.now()
                });
                io.to(channel).emit("updateUsersInChannel", {
                    error: false,
                    message: `Here the updated user list for channel [${channel}]`,
                    data: {
                        users: ircService.listChannelUsers(channel),
                        channel: channel
                    },
                    timestamp: tools.now()
                });
                return cb({ error: false, message: `You join the channel ${channel}`, timestamp: tools.now() });
            });
        },
        leaveChannel: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            ircService.leaveChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb({ error: true, message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${user.nickname} left the channel ${channel} !`);

                socket.broadcast.to(channel).emit("userLeftChannel", {
                    nickname: "SERVER",
                    message: `${user.nickname} has left the channel [${channel}]`,
                    timestamp: tools.now()
                });
                if (ircService.channelExist(channel)) {
                    io.to(channel).emit("updateUsersInChannel", {
                        error: false,
                        message: `Here the updated user list for channel [${channel}]`,
                        data: {
                            users: ircService.listChannelUsers(channel),
                            channel: channel
                        },
                        timestamp: tools.now()
                    });
                }
                return cb({ error: false, message: `You left the channel ${channel}`, timestamp: tools.now() });
            });
        },
        listChannelUsers: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!ircService.channelExist(channel)) {
                return cb({
                    error: true,
                    message: "This channel doesn't exist !",
                    data: [],
                    timestamp: tools.now()
                });
            }

            var users = ircService.listChannelUsers(channel);
            console.log(`[${tools.datetime()}] - ${user.nickname} ask for channel [${channel}] users list!`);
            return cb({
                error: false,
                message: `Here the user list for channel [${channel}]`,
                data: users,
                timestamp: tools.now()
            });
        },
        listChannels: function (string, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            var channels = ircService.listChannels();
            var message = `Here's the channels list`;

            string = string.trim() || "";
            if (string) {
                message = message + ` containing ${string}`;
                channels = channels.filter(function (channel) {
                    return channel.includes(string);
                });
            }

            console.log(`[${tools.datetime()}] - ${user.nickname} ask for channels list!`);
            return cb({
                error: false,
                message: message,
                data: channels,
                timestamp: tools.now()
            });
        },
        changeNickname: function (newNickname, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);
            var oldNickname = user.nickname;

            newNickname = newNickname.trim() || "";
            if (!newNickname) {
                return cb({ error: true, message: "This nickname is too short !", timestamp: tools.now() });
            }

            ircService.changeUserNickname(user, newNickname, function (err, msg) {
                if (err) {
                    return cb({ error: true, message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${oldNickname} change is nickname to ${user.nickname} !`);

                user.channels.forEach(function (channel) {
                    socket.broadcast.to(channel).emit("hasChangeNickname", {
                        nickname: "SERVER",
                        message: `${oldNickname} change is nickname to ${user.nickname} !`,
                        timestamp: tools.now()
                    });
                });
                return cb({ error: false, message: msg || `You change your nickname from ${oldNickname} to ${user.nickname}`, timestamp: tools.now() });
            });
        },
        sendPrivateMessage: function (to, content, cb) {
            var socket = this;
            var fromUser = ircService.getUserBySocketId(socket.id);

            to = to.trim() || "";
            var toUser = ircService.getUserByNickname(to);
            if (!toUser) {
                return cb({ error: true, message: `The user ${to} doesn't exist.`, timestamp: tools.now() });
            }

            content = content.trim() || "";
            if (!content) {
                return cb({ error: true, message: `You can't send an empty private-message`, timestamp: tools.now() });
            }

            io.to(toUser.socket.id).emit('receivePrivateMessage', {
                nickname: fromUser.nickname,
                message: content,
                timestamp: tools.now()
            });
            console.log(`[${tools.datetime()}] - ${fromUser.nickname} send a PM to ${toUser.nickname} !`);
            return cb({ error: false, message: `Your message was delivered to ${to}`, timestamp: tools.now() });
        },
        sendMessage: function (channel, content, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            channel = channel.trim() || "";
            if (!ircService.channelExist(channel)) {
                return cb({ error: true, message: `The channel ${channel} doesn't exist.`, timestamp: tools.now() });
            }

            content = content.trim() || "";
            if (!content) {
                return cb({ error: true, message: `You can't send an empty message`, timestamp: tools.now() });
            }

            io.to(channel).emit("receiveMessage", {
                nickname: user.nickname,
                message: content,
                channel: channel,
                timestamp: tools.now()
            });
            console.log(`[${tools.datetime()}] - ${user.nickname} send a message to channel [${channel}] !`);
            return cb({ error: false, message: `Your message was delivered`, timestamp: tools.now() });
        },
        disconnect: function () {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            user.channels.forEach(function (channel) {
                ircService.leaveChannel(user, channel, function (err, msg) {
                    console.log(`[${tools.datetime()}] - ${user.nickname} left the channel ${channel} !`);
                    socket.broadcast.to(channel).emit("userLeftChannel", {
                        nickname: "SERVER",
                        message: `${user.nickname} has left the channel [${channel}]`,
                        timestamp: tools.now()
                    });
                });
            });

            console.log(`[${tools.datetime()}] - ${user.nickname} has left the server !`);
            return ircService.removeUser(user);
        }
    };
};

module.exports = handlers;