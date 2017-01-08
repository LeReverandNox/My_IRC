/*jslint node: true this:true es6:true */
/*global this*/
const inert = require("inert");
const vision = require("vision");
const irc = require("./irc");

const plugins = [
    inert,
    vision,
    irc
];

module.exports = plugins;