/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = function (server, options, next) {
    var io = require('socket.io')(server.listener);
    var ircService = require("./services/ircService")(server, io).init();
    var handlers = require("./handlers")(server, ircService, io);

    io.on("connection", connectionHandler);

    function connectionHandler(socket) {
        handlers.handleNewUser(socket);

        /*
         * Channels
         */
        socket.on("joinChannel", handlers.joinChannel);
        socket.on("leaveChannel", handlers.leaveChannel);
        socket.on("listChannelUsers", handlers.listChannelUsers);
        socket.on("listChannels", handlers.listChannels);

        /*
         * Users
         */
        socket.on("changeNickname", handlers.changeNickname);

        /*
         * Messages
         */
        socket.on("sendPrivateMessage", handlers.sendPrivateMessage);
        socket.on("sendMessage", handlers.sendMessage);

        socket.on("disconnect", handlers.disconnect);
    }

    next();
};

exports.register.attributes = {
    name: "hapi-irc"
};