/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

const ressourcesRoutes = [
    {
        method: "GET",
        path: "/",
        handler: function (request, reply) {
            reply.view("index");
        }
    },
    {
        method: "GET",
        path: "/css/{file*}",
        handler: {
            directory: {
                path: "public/css"
            }
        }
    },
    {
        method: "GET",
        path: "/js/{file*}",
        handler: {
            directory: {
                path: "public/js"
            }
        }
    }
];

module.exports = ressourcesRoutes;