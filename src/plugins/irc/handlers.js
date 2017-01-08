/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var handlers = function (server, ircService) {
    return {
        handleNewUser: function (socket) {
            console.log("Here's a new connection");
            return socket.emit("handshake", `Welcome to you sir, to My_IRC ! Feel free to join a channel (/help)`);
        },
        disconnect: function (socket) {
            console.log("Bye bye !");
        }
    };
};

module.exports = handlers;