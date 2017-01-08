/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Index", IndexController);

    function IndexController() {
        var I = this;

        I.title = "My_IRC";
    }
}());