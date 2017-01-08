/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .config(materialConfig);

    materialConfig.$inject = ["$mdThemingProvider"];

    function materialConfig($mdThemingProvider) {
        $mdThemingProvider.theme("default")
            .primaryPalette("blue")
            .backgroundPalette("blue-grey");
    }
}());