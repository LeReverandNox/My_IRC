/*jslint node: true this:true es6:true */
/*global this*/

"use strict";
const config = require("../config");

const ressourcesRoutes = function () {
    var devRoutes = [
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

    var prodRoutes = [
        {
            method: "GET",
            path: "/css/{file*}",
            handler: {
                directory: {
                    path: "public_dist/css"
                }
            }
        },
        {
            method: "GET",
            path: "/js/app/{file*}",
            handler: {
                directory: {
                    path: "public_dist/js/app"
                }
            }
        }
    ];

    switch (config.applicationEnv) {
    case "development":
        return devRoutes;
    case "production":
        return prodRoutes;
    }
};

module.exports = ressourcesRoutes();