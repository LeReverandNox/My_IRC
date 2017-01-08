/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var ircService = function (server) {
    return {
        init: function () {
            console.log("On initialise le serveur IRC");

            server.irc = {};
            server.irc.users = {};
            server.irc.channels = {};

            return server;
        }
    };
};

module.exports = ircService;