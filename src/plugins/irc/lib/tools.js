/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var Chance = require("chance");
var chance = new Chance();

var leftPadDate = function (elem) {
    if (elem < 10) {
        elem = "0" + elem;
    }
    return elem;
};

var tools = {
    generateNickname: require("./nicknameGenerator"),
    generateHash: function () {
        return "#" + chance.zip();
    },
    now: function () {
        return new Date().getTime();
    },
    datetime: function () {
        var dateObj = new Date();

        var month = (dateObj.getUTCMonth() + 1);
        month = leftPadDate(month);

        var day = dateObj.getUTCDate();
        day = leftPadDate(day);

        var year = dateObj.getUTCFullYear();

        var hours = dateObj.getUTCHours();
        hours = leftPadDate(hours);

        var minutes = dateObj.getUTCMinutes();
        minutes = leftPadDate(minutes);

        var secondes = dateObj.getUTCSeconds();
        secondes = leftPadDate(secondes);

        return `${day}/${month}/${year} - ${hours}:${minutes}:${secondes}`;
    }
};

module.exports = tools;