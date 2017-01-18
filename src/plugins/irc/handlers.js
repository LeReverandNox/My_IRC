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
        desc: "/join #[channel] - Join the channel",
        action: function (channel, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            channel = channel.trim() || "";
            if (!channel) {
                return cb({ error: true, nickname: "", message: "You must specify a channel name.", timestamp: tools.now() });
            }
            if (!channel.match(/^#[A-Za-z0-9]+$/)) {
                return cb({ error: true, nickname: "", message: "The channel name must start with a # an be alpha-numerical.", timestamp: tools.now() });
            }
            if (channel.length > 20) {
                return cb({ error: true, nickname: "", message: "This channel name is too long.", timestamp: tools.now() });

            }

            ircService.joinChannel(user, channel, function (err, msg) {
                if (err) {
                    return cb({ error: true, nickname: "", message: msg, timestamp: tools.now() });
                }
                console.log(`[${tools.datetime()}] - ${user.nickname} join the channel ${channel} !`);

                socket.broadcast.to(channel).emit("userJoinChannel", {
                    nickname: "SERVER",
                    channel: channel,
                    message: `${user.nickname} join the channel ${channel}`,
                    timestamp: tools.now()
                });
                cb({ error: false, nickname: "", channelName: channel, message: `You join the channel ${channel}`, timestamp: tools.now() });
                return updateUsersInChannel(channel);
            });
        }
    };

    var leaveChannel = {
        desc: "/part [?channel] - Leave the current channel, or the one specified",
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
                        message: `${user.nickname} has left the channel ${channel}`,
                        timestamp: tools.now()
                    });
                    updateUsersInChannel(channel);
                }
                return cb({ error: false, nickname: "", channelName: channel, message: `You left the channel ${channel}`, timestamp: tools.now() });
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
            console.log(`[${tools.datetime()}] - ${user.nickname} ask for channel ${channel} users list!`);
            return cb({
                error: false,
                nickname: "SERVER",
                message: `Here the user list for the channel ${channel} :`,
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
                return cb({ error: true, nickname: "", message: "You must choose a nickname.", timestamp: tools.now() });
            }
            if (!newNickname.match(/^[a-zA-Z0-9]+$/)) {
                return cb({ error: true, nickname: "", message: "Your nickname must be alphanumerical.", timestamp: tools.now() });
            }
            if (newNickname.length > 20) {
                return cb({ error: true, nickname: "", message: "Your nickname is too long.", timestamp: tools.now() });
            }
            if (newNickname === oldNickname) {
                return cb({ error: true, nickname: "", message: "Your already have this nickname.", timestamp: tools.now() });
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
            user.messageCount += 1;

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
            }).sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
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

    var randomGiphy = {
        desc: "/giphy [?tag] - Send a gif to the current channel",
        action: function (channel, tag, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!channel || channel.trim() === "") {
                return cb({ error: true, nickname: "", message: `You must be in a channel to send a message.`, timestamp: tools.now() });
            }

            channel = channel.trim();
            if (!ircService.channelExist(channel)) {
                return cb({ error: true, nickname: "", message: `The channel ${channel} doesn't exist.`, timestamp: tools.now() });
            }

            tag = tag.trim();

            if (!ircService.isUserInChannel(user, channel)) {
                return cb({ error: true, nickname: "", message: `You are not a member of this channel.`, timestamp: tools.now() });
            }

            tools.getGif(tag, function (err, content) {
                if (err) {
                    return cb({ error: true, nickname: "", message: content, timestamp: tools.now() });
                }

                io.to(channel).emit("receiveMessage", {
                    nickname: user.nickname,
                    message: `/giphy ${tag}`,
                    attachment: content,
                    channel: channel,
                    timestamp: tools.now()
                });
                console.log(`[${tools.datetime()}] - ${user.nickname} send a gif to channel [${channel}] !`);
                return cb({ error: false, nickname: "SERVER", message: `Your gif was delivered`, timestamp: tools.now() });
            });
        }
    };

    var meAction = {
        desc: "/me [action] - Send an action message on the current channel",
        action: function (channel, action, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!channel || channel.trim() === "") {
                return cb({ error: true, nickname: "", message: `You must be in a channel to send an action message.`, timestamp: tools.now() });
            }

            channel = channel.trim();
            if (!ircService.channelExist(channel)) {
                return cb({ error: true, nickname: "", message: `The channel ${channel} doesn't exist.`, timestamp: tools.now() });
            }

            if (!action || action.trim() === "") {
                return cb({ error: true, nickname: "", message: `You can't send an empty action message`, timestamp: tools.now() });
            }
            action = action.trim();

            if (!ircService.isUserInChannel(user, channel)) {
                return cb({ error: true, nickname: "", message: `You are not a member of this channel.`, timestamp: tools.now() });
            }

            io.to(channel).emit("receiveMessage", {
                nickname: "",
                message: `${user.nickname} ${action}`,
                channel: channel,
                timestamp: tools.now()
            });
            console.log(`[${tools.datetime()}] - ${user.nickname} send a action message to channel [${channel}] !`);
            return cb({ error: false, nickname: "SERVER", message: `Your action message was delivered`, timestamp: tools.now() });
        }
    };

    var ameAction = {
        desc: "/ame [action] - Send an action message to all channels you're in",
        action: function (action, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!action || action.trim() === "") {
                return cb({ error: true, nickname: "", message: `You can't send an empty action message`, timestamp: tools.now() });
            }
            action = action.trim();

            if (user.channels.length === 0) {
                return cb({ error: true, nickname: "", message: `You need to in at least one channel to send a global action message`, timestamp: tools.now() });
            }

            user.channels.forEach(function (channel) {
                console.log(`[${tools.datetime()}] - ${user.nickname} send a action message to channel [${channel}] !`);
                io.to(channel).emit("receiveMessage", {
                    nickname: "",
                    message: `${user.nickname} ${action}`,
                    channel: channel,
                    timestamp: tools.now()
                });
            });
            return cb({ error: false, nickname: "SERVER", message: `Your global action message was delivered`, timestamp: tools.now() });
        }
    };

    var sendMessageAll = {
        desc: "/amsg [message] - Send a message to all channels you're in",
        action: function (content, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            if (!content || content.trim() === "") {
                return cb({ error: true, nickname: "", message: `You can't send an empty message`, timestamp: tools.now() });
            }
            content = content.trim();

            if (user.channels.length === 0) {
                return cb({ error: true, nickname: "", message: `You need to in at least one channel to send a global message`, timestamp: tools.now() });
            }

            user.channels.forEach(function (channel) {
                console.log(`[${tools.datetime()}] - ${user.nickname} send a message to channel [${channel}] !`);
                io.to(channel).emit("receiveMessage", {
                    nickname: user.nickname,
                    message: content,
                    channel: channel,
                    timestamp: tools.now()
                });
                user.messageCount += 1;
            });
            return cb({ error: false, nickname: "SERVER", message: `Your global message was delivered`, timestamp: tools.now() });
        }
    };

    var whois = {
        desc: "/whois [nickname] - Get informations about a user",
        action: function (nickname, cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            nickname = nickname.trim() || "";
            if (!nickname) {
                return cb({ error: true, nickname: "", message: `You need to specify a nickname .`, timestamp: tools.now() });
            }
            var targetUser = ircService.getUserByNickname(nickname);
            if (!targetUser) {
                return cb({ error: true, nickname: "", message: `The user ${nickname} doesn't exist.`, timestamp: tools.now() });
            }

            var infos = ircService.getUserInfos(targetUser);
            console.log(`[${tools.datetime()}] - ${user.nickname} ask for informations about ${targetUser.nickname} !`);
            return cb({
                error: false,
                nickname: "SERVER",
                message: `Here's some informations about ${targetUser.nickname} :`,
                data: infos,
                timestamp: tools.now()
            });
        }
    };

    var listServerUsers = {
        desc: "/ausers - List all users connected to the server",
        action: function (cb) {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            var users = ircService.listServerUsers().map(function (user) {
                return user.nickname;
            });

            console.log(`[${tools.datetime()}] - ${user.nickname} ask for the whole users list!`);
            return cb({
                error: false,
                nickname: "SERVER",
                message: "Here's the list of all users connected to the server :",
                data: users,
                timestamp: tools.now()
            });
        }
    };

    var disconnect = {
        desc: null,
        action: function () {
            var socket = this;
            var user = ircService.getUserBySocketId(socket.id);

            var channels = user.channels.slice();
            channels.forEach(function (channel) {
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
        randomGiphy: randomGiphy,
        meAction: meAction,
        ameAction: ameAction,
        sendMessageAll: sendMessageAll,
        whois: whois,
        listServerUsers: listServerUsers,
        disconnect: disconnect
    };
};

module.exports = handlers;