/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var tools = require("./lib/tools");

var handlers = function (ircService, io) {
    function updateUsersInChannel(channel) {
        return io.to(channel).emit("updateUsersInChannel", {
            error: false,
            nickname: "SERVER",
            message: `Here the updated user list for channel [${channel}]`,
            data: {
                users: ircService.listChannelUsers(channel),
                channel: channel
            },
            timestamp: tools.now()
        });
    }

    var handleNewUser = {
        desc: null,
        action: function (socket) {
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
        }
    };

    var joinChannel = {
        desc: "/join [channel] - Join the channel",
        action: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            channel = channel.trim() || "";
            if (!channel) {
                return cb({ error: true, nickname: "", message: "This channel name is too short !", timestamp: tools.now() });
            }

            ircService.joinChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb({ error: true, nickname: "", message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${user.nickname} join the channel ${channel} !`);

                socket.broadcast.to(channel).emit("userJoinChannel", {
                    nickname: "SERVER",
                    channel: channel,
                    message: `${user.nickname} join the channel [${channel}]`,
                    timestamp: tools.now()
                });
                cb({ error: false, nickname: "", channelName: channel, message: `You join the channel [${channel}]`, timestamp: tools.now() });
                return updateUsersInChannel(channel);
            });
        }
    };

    var leaveChannel = {
        desc: "/leave [?channel] - Leave the current channel, or the one specified",
        action: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            ircService.leaveChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb({ error: true, nickname: "", message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${user.nickname} left the channel ${channel} !`);

                if (ircService.channelExist(channel)) {
                    socket.broadcast.to(channel).emit("userLeftChannel", {
                        nickname: "SERVER",
                        channel: channel,
                        message: `${user.nickname} has left the channel [${channel}]`,
                        timestamp: tools.now()
                    });
                    updateUsersInChannel(channel);
                }
                return cb({ error: false, nickname: "", channelName: channel, message: `You left the channel [${channel}]`, timestamp: tools.now() });
            });
        }
    };

    var listChannelUsers = {
        desc: "/users [?channel] - Get the list of users for the current channel, or for the one specified",
        action: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!channel || channel.trim() === "") {
                return cb({ error: true, nickname: "", message: `You must be in a channel to list users.`, timestamp: tools.now() });
            }

            channel = channel.trim();
            if (!ircService.channelExist(channel)) {
                return cb({
                    error: true,
                    nickname: "",
                    message: "This channel doesn't exist !",
                    data: [],
                    timestamp: tools.now()
                });
            }

            var users = ircService.listChannelUsers(channel);
            console.log(`[${tools.datetime()}] - ${user.nickname} ask for channel [${channel}] users list!`);
            return cb({
                error: false,
                nickname: "SERVER",
                message: `Here the user list for the channel [${channel}] :`,
                data: users,
                timestamp: tools.now()
            });
        }
    };

    var listChannels = {
        desc: "/list [?string] - Get the list of all the channels, or containing the string",
        action: function (string, cb) {
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
                nickname: "SERVER",
                message: `${message} :`,
                data: channels,
                timestamp: tools.now()
            });
        }
    };

    var changeNickname = {
        desc: "/nick [nickname] - Change your nickname",
        action: function (newNickname, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);
            var oldNickname = user.nickname;

            newNickname = newNickname.trim() || "";
            if (!newNickname) {
                return cb({ error: true, nickname: "", message: "This nickname is too short !", timestamp: tools.now() });
            }
            if (newNickname.match(/\s+/)) {
                return cb({ error: true, nickname: "", message: "Your nickname can't contain spaces !", timestamp: tools.now() });
            }

            ircService.changeUserNickname(user, newNickname, function (err, msg) {
                if (err) {
                    return cb({ error: true, nickname: "", message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${oldNickname} change is nickname to ${user.nickname} !`);

                user.channels.forEach(function (channel) {
                    updateUsersInChannel(channel);
                    socket.broadcast.to(channel).emit("hasChangeNickname", {
                        nickname: "SERVER",
                        channel: channel,
                        message: `${oldNickname} change is nickname to ${user.nickname} !`,
                        timestamp: tools.now()
                    });
                });
                return cb({ error: false, nickname: "", message: msg || `You change your nickname from ${oldNickname} to ${user.nickname}`, timestamp: tools.now() });
            });
        }
    };

    var sendPrivateMessage = {
        desc: "/msg [receiver] [content] - Send a private message to a connected user",
        action: function (to, content, cb) {
            var socket = this;
            var fromUser = ircService.getUserBySocketId(socket.id);

            to = to.trim() || "";
            var toUser = ircService.getUserByNickname(to);
            if (!toUser) {
                return cb({ error: true, nickname: "", message: `The user ${to} doesn't exist.`, timestamp: tools.now() });
            }

            content = content.trim() || "";
            if (!content) {
                return cb({ error: true, nickname: "", message: `You can't send an empty private-message`, timestamp: tools.now() });
            }

            io.to(toUser.socket.id).emit('receivePrivateMessage', {
                nickname: `FROM: ${fromUser.nickname}`,
                message: content,
                timestamp: tools.now()
            });
            console.log(`[${tools.datetime()}] - ${fromUser.nickname} send a PM to ${toUser.nickname} !`);
            return cb({ error: false, nickname: `TO: ${toUser.nickname}`, message: content, timestamp: tools.now() });
        }
    };

    var sendMessage = {
        desc: null,
        action: function (channel, content, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!channel || channel.trim() === "") {
                return cb({ error: true, nickname: "", message: `You must be in a channel to send a message.`, timestamp: tools.now() });
            }

            channel = channel.trim();
            if (!ircService.channelExist(channel)) {
                return cb({ error: true, nickname: "", message: `The channel ${channel} doesn't exist.`, timestamp: tools.now() });
            }

            if (!content || content.trim() === "") {
                return cb({ error: true, nickname: "", message: `You can't send an empty message`, timestamp: tools.now() });
            }
            content = content.trim();

            if (!ircService.isUserInChannel(user, channel)) {
                return cb({ error: true, nickname: "", message: `You are not a member of this channel.`, timestamp: tools.now() });
            }

            io.to(channel).emit("receiveMessage", {
                nickname: user.nickname,
                message: content,
                channel: channel,
                timestamp: tools.now()
            });
            console.log(`[${tools.datetime()}] - ${user.nickname} send a message to channel [${channel}] !`);
            return cb({ error: false, nickname: "SERVER", message: `Your message was delivered`, timestamp: tools.now() });
        }
    };

    var listCommands = {
        desc: "/help - Show the list of available commands",
        action: function (cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            var commands = handlers();
            var commandList = Object.keys(commands).filter(function (fn) {
                if (commands[fn].desc !== null) {
                    return true;
                }
            }).map(function (fn) {
                return commands[fn].desc;
            });

            console.log(`[${tools.datetime()}] - ${user.nickname} ask for the command list!`);
            return cb({
                error: false,
                nickname: "SERVER",
                message: "Here's the available command list :",
                data: commandList,
                timestamp: tools.now()
            });
        }
    };

    var disconnect = {
        desc: null,
        action: function () {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            user.channels.forEach(function (channel) {
                ircService.leaveChannel(user, channel, function (err, msg) {
                    console.log(`[${tools.datetime()}] - ${user.nickname} left the channel ${channel} !`);
                    if (ircService.channelExist(channel)) {
                        updateUsersInChannel(channel);
                        socket.broadcast.to(channel).emit("userLeftChannel", {
                            nickname: "SERVER",
                            channel: channel,
                            message: `${user.nickname} has left the channel [${channel}]`,
                            timestamp: tools.now()
                        });
                    }
                });
            });

            console.log(`[${tools.datetime()}] - ${user.nickname} has left the server !`);
            return ircService.removeUser(user);
        }
    };

    return {
        handleNewUser: handleNewUser,
        joinChannel: joinChannel,
        leaveChannel: leaveChannel,
        listChannelUsers: listChannelUsers,
        listChannels: listChannels,
        changeNickname: changeNickname,
        sendPrivateMessage: sendPrivateMessage,
        sendMessage: sendMessage,
        listCommands: listCommands,
        disconnect: disconnect
    };
};

module.exports = handlers;