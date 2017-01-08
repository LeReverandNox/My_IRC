/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var tools = require("./lib/tools");

var handlers = function (server, ircService) {
    return {
        handleNewUser: function (socket) {
            console.log("Here's a new connection");

            var nickname = tools.generateNickname();
            ircService.addUser(nickname, socket);

            return socket.emit("handshake", {
                message: `Welcome to you sir ${nickname}, to My_IRC ! Feel free to join a channel (/help)`,
                nickname: nickname
            });
        },
        disconnect: function (socket) {
            console.log("Bye bye !");
        }
    };
};

module.exports = handlers;