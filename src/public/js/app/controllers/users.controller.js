/*jslint*/
/*global angular*/

(function () {
    "use strict";

    angular
        .module("my_irc")
        .controller("Users", UsersController);

    UsersController.$inject = ["$rootScope", "$scope"];

    function UsersController($rootScope, $scope) {
        var U = this;
        var I = $scope.I;

        U.title = "Users";
        U.channels = I.channels;

        $rootScope.$on("updateUsersInChannel", function (e, res) {
            var channel = I.getChannelByName(res.data.channel);
            channel.users = res.data.users;
        });
    }
} ());