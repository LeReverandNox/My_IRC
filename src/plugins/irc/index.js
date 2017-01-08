/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

exports.register = function (server, options, next) {
    var io = require('socket.io')(server.listener);

    io.on("connection", connectionHandler);

    function connectionHandler(socket) {
        console.log("Here's a new connection");
        socket.emit("welcome", "Welcome you sir !");
    }

    next();
};

exports.register.attributes = {
    name: "hapi-irc"
};