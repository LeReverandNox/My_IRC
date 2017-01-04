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
    }
];

module.exports = ressourcesRoutes;