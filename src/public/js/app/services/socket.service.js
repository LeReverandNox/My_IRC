/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .factory("socketService", socketService);

    socketService.$inject = ["socketFactory"];

    function socketService(socketFactory) {
        return socketFactory();
    }
}());