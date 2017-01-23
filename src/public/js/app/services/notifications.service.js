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
            notifHandler: notifHandler
        };

        return service;

        function show(channelName, content) {
            var options = {
                body: content.text,
                autoClose: 3000
            };

            webNotification.showNotification(channelName, options, this.notifHandler);
        }

        function notifHandler(error, hide) {
        }
    }
} ());