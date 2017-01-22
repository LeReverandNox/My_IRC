/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("formatterService", formatterService);

    function formatterService() {
        var service = {
            leftPadDate: leftPadDate,
            computeDate: computeDate,
            format: format,
            formatDate: formatDate,
            formatNickname: formatNickname,
            formatContent: formatContent,
            getYoutubeLinks: getYoutubeLinks
        };

        return service;

        function leftPadDate(elem) {
            if (elem < 10) {
                elem = "0" + elem;
            }
            return elem;
        }

        function computeDate(timestamp) {
            var dateObj = new Date(timestamp);

            var month = (dateObj.getUTCMonth() + 1);
            month = this.leftPadDate(month);

            var day = dateObj.getUTCDate();
            day = this.leftPadDate(day);

            var year = dateObj.getUTCFullYear();

            var hours = dateObj.getUTCHours();
            hours = this.leftPadDate(hours);

            var minutes = dateObj.getUTCMinutes();
            minutes = this.leftPadDate(minutes);

            var secondes = dateObj.getUTCSeconds();
            secondes = this.leftPadDate(secondes);

            return {
                year: year,
                month: month,
                day: day,
                hours: hours,
                minutes: minutes,
                secondes: secondes
            };
        }

        function format(data) {
            var date = this.formatDate(data.timestamp);
            var nickname = this.formatNickname(data.nickname);
            var content = this.formatContent(data.message, data.data);
            var attachment = data.attachment;
            var video = this.getYoutubeLinks(content);

            return {
                text: date + " " + nickname + " " + content,
                attachment: attachment,
                video: video
            };
        }

        function formatDate(timestamp) {
            var dateObjs = this.computeDate(timestamp);
            return dateObjs.hours + ":" + dateObjs.minutes + ":" + dateObjs.secondes;
        }

        function formatNickname(nickname) {
            return nickname.length > 0 ? "<" + nickname + ">" : "";
        }

        function formatContent(content, data) {
            content = content.trim();

            if (data) {
                data.forEach(function (el) {
                    content = content + "\n - " + el;
                });
            }

            return content;
        }

        function getYoutubeLinks(content) {
            var ytRegex = /(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
            var links = content.match(ytRegex);

            return links !== null ? links[0] : null;
        }
    }
} ());