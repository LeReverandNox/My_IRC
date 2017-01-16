/*jslint node: true this:true es6:true */
/*global this*/
const baseRoutes = require("./base");
const ressourcesRoutes = require("./ressources");

const routes = [].concat(baseRoutes, ressourcesRoutes);
module.exports = routes;