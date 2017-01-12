/*jslint node: true this:true es6:true */
/*global this*/

/// <reference path="../typings/index.d.ts" />

"use strict";
const Hapi = require("hapi");
const ejs = require("ejs");
const config = require("./config");
const plugins = require("./plugins");
const routes = require("./routes");
const tools = require("./plugins/irc/lib/tools");
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

    server.views({
        engines: {ejs},
        relativeTo: __dirname,
        path: "views"
    });

    server.route(routes);

    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log(`[${tools.datetime()}] - The IRC app is now running on port ${server.info.port}`);
    });
});