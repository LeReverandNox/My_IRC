/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

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
        },
        removeUser: function (socket) {
            var index = server.irc.users.findIndex(function (user) {
                return user.socketId === socket.id;
            });
            server.irc.users.splice(index, 1);
        }
    };
};

module.exports = ircService;