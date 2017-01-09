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
                socketId: socket.id
            };
            server.irc.users.push(user);
            return user;
        },
        removeUser: function (socket) {
            var index = this.getUserBySocketId(socket.id);
            server.irc.users.splice(index, 1);
        },
        getUserBySocketId: function (socketId) {
            var user = server.irc.users.filter(function (user) {
                return user.socketId === socketId;
            })[0];
            return user;
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