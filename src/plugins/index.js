/*jslint node: true this:true es6:true */
/*global this*/
const inert = require("inert");
const vision = require("vision");

const plugins = [
    inert,
    vision
];

module.exports = plugins;