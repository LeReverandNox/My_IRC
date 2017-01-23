/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("notificationsService", notificationsService);

    notificationsService.$inject = ["webNotification", "$rootScope"];

    function notificationsService(webNotification, $rootScope) {
        var service = {
            show: show,
            notifHandler: notifHandler,
            format: format
        };

        return service;

        function show(channelName, message) {
            var formattedMsg = this.format(message);

            var options = {
                body: formattedMsg,
                autoClose: 3000
            };

            webNotification.showNotification(channelName, options, this.notifHandler);
        }

        function notifHandler(error, hide) {
        }

        function format(message) {
            var content = "";
            if (message.nickname !== "SERVER") {
                content += "<" + message.nickname + "> ";
            }
            content += message.content;

            return content;
        }
    }
} ());