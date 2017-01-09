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
        disconnect: function () {
            console.log("Bye bye !");
            ircService.removeUser(this);
        }
    };
};

module.exports = handlers;