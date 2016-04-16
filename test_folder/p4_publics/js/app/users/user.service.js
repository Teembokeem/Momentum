(function () {
  'use strict';

  angular
    .module('app')
    .factory("userService", userService);

  userService.$inject = ["$log", "$http", "tokenService"];

  function userService($log, $http, token) {
    $log.debug("userService loaded!");

    var service = {
      create: create,
      update: update
    };
    return service;

    function create(data) {
      var promise = $http({
        method: 'POST',
        url:    '/api/users',
        data:   data
      });

      return promise;
    }

    function update(data) {
      var promise = $http({
        method: 'PUT',
        url:    '/api/users/me',
        data:   data
      });

      return promise;
    }
  }

})();
