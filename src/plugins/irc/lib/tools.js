/*jslint node: true this:true es6:true */
/*global this*/

"use strict";

var Chance = require("chance");
var chance = new Chance();
var request = require("request");
var config = require("../../../config");
var timespan = require('readable-timespan');

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
    },
    getGif: function (tag, cb) {
        var self = this;
        var url = `${config.giphyBaseURL}?api_key=${config.giphyAPIKey}&tag=${tag}`;

        request.get(url, function (err, r, body) {
            if (err) {
                console.error(`[${self.datetime()}] - Something went wrong on Giphy request :`);
                console.error(err);
                return cb(true, "Giphy is currently not available, please try later.");
            }

            var parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch (err) {
                console.error(`[${self.datetime()}] - Something went wrong on parsing Giphy's response :`);
                console.error(err);
                return cb(true, "A Giphy error occured.");
            }

            if (parsedBody.data.length === 0) {
                return cb(true, `No gif found for ${tag}`);
            }

            var gifUrl = parsedBody.data.fixed_height_downsampled_url;
            cb(false, gifUrl);
        });
    },
    getUptime: function () {
        return timespan.parse(process.uptime() * 1000);
    }
};

module.exports = tools;