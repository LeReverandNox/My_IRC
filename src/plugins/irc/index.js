/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = function (server, options, next) {
    var io = require('socket.io')(server.listener);
    var ircService = require("./services/ircService")(server, io).init();
    var handlers = require("./handlers")(ircService, io);

    io.on("connection", connectionHandler);

    function connectionHandler(socket) {
        handlers.handleNewUser.action(socket);

        /*
         * Channels
         */
        socket.on("joinChannel", handlers.joinChannel.action);
        socket.on("leaveChannel", handlers.leaveChannel.action);
        socket.on("listChannelUsers", handlers.listChannelUsers.action);
        socket.on("listChannels", handlers.listChannels.action);

        /*
         * Users
         */
        socket.on("changeNickname", handlers.changeNickname.action);

        /*
         * Messages
         */
        socket.on("sendPrivateMessage", handlers.sendPrivateMessage.action);
        socket.on("sendMessage", handlers.sendMessage.action);
        socket.on("randomGiphy", handlers.randomGiphy.action);
        socket.on("meAction", handlers.meAction.action);
        socket.on("ameAction", handlers.ameAction.action);
        socket.on("sendMessageAll", handlers.sendMessageAll.action);

        socket.on("listCommands", handlers.listCommands.action);

        socket.on("disconnect", handlers.disconnect.action);
    }

    next();
};

exports.register.attributes = {
    name: "hapi-irc"
};