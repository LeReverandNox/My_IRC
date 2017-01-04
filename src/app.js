/*jslint node: true this:true es6:true */
/*global this*/

/// <reference path="../typings/index.d.ts" />

"use strict";
const Hapi = require("hapi");
const config = require("./config");
const plugins = require("./plugins");
const routes = require("./routes");

const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        },
        router: {
            stripTrailingSlash: true
        }
    }
});

server.connection({
    port: config.server.port
});

server.register(plugins, function (err) {
    if (err) {
        throw err;
    }

    server.route(routes);

    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log("The IRC app is now running on port " + server.info.port + " :)");
    });
});