(function () {
  'use strict';

  angular
    .module('Momentum')
    .factory("tokenService", tokenService);

  tokenService.$inject = ["$log", "$window"];

  function tokenService($log, $window) {
    $log.debug("tokenService loaded!");

    const TOKEN_KEY = 'moment_token';
    var service = {
      store:    store,
      retrieve: retrieve,
      decode:   decode,
      destroy:  destroy
    };
    return service;

    function store(token) {
      $window.localStorage.setItem(TOKEN_KEY, token);
    }

    function retrieve() {
      return $window.localStorage.getItem(TOKEN_KEY);
    }

    function decode() {
      var token = retrieve();
      if (token) {
        return $window.jwt_decode(token);
      } else {
        return null;
      }
    }

    function destroy() {
      $window.localStorage.removeItem(TOKEN_KEY);
    }
  }

})();
