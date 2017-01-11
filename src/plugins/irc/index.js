/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = function (server, options, next) {
    var io = require('socket.io')(server.listener);
    var ircService = require("./services/ircService")(server).init();
    var handlers = require("./handlers")(server, ircService);

    io.on("connection", connectionHandler);

    function connectionHandler(socket) {
        handlers.handleNewUser(socket);

        socket.on("disconnect", handlers.disconnect);
    }

    next();
};

exports.register.attributes = {
    name: "hapi-irc"
};