/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Index", IndexController);

    function IndexController() {
        console.log("Bienvenue dans IndexController");
    }
}());