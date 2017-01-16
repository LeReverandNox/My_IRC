/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const config = require("../config");

const baseRoutes = [
    {
        method: "GET",
        path: "/",
        handler: function (request, reply) {
            reply.view("index", {
                applicationEnv: config.applicationEnv
            });
        }
    },
    {
        method: "GET",
        path: "/partials/{file*}",
        handler: {
            directory: {
                path: "views/partials"
            }
        }
    },
    {
        method: "GET",
        path: "/js/lib/{file*}",
        handler: {
            directory: {
                path: "public/js/lib"
            }
        }
    }
];

module.exports = baseRoutes;