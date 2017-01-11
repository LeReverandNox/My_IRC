/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var Chance = require("chance");
var chance = new Chance();

var tools = {
    generateNickname: require("./nicknameGenerator"),
    generateHash: function () {
        return "#" + chance.zip();
    }
};

module.exports = tools;