/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Commands", CommandsController);

    CommandsController.$inject = ["$rootScope", "$scope"];

    function CommandsController($rootScope, $scope) {
        var C = this;
        var I = $scope.I;

        C.title = "Commands";

    }
} ());