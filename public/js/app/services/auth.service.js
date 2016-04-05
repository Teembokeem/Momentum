(function () {
  'use strict';

  angular
    .module('app')
    .factory("authService", authService);

  authService.$inject = ["$log", "tokenService", "$http"];

  function authService($log, token, $http) {
    $log.debug("authService loaded!");

    var service = {
      logIn:        logIn,
      isLoggedIn:   isLoggedIn,
      logOut:       logOut,
      currentUser:  currentUser,
      refreshToken: refreshToken
    };
    return service;

    function refreshToken() {
      var promise = $http({
        method: 'POST',
        url:    '/api/users/me/token'
      })
      .then(function(res) {
        token.store(res.data.token);
        return token.decode();
      });

      return promise;
    }

    function currentUser() {
      var tokenData = token.decode();

      if (tokenData) {
        // No real reason to do this, just showing you
        // how it can be done. We can clean out (remove)
        // properties from the token that are about the token
        // itself, not the user; this cleans up the data.
        tokenData.expiresAt = Date(tokenData.exp);

        delete tokenData.exp;
        delete tokenData.iat;
      }

      $log.debug("Current user retrieved:", tokenData);

      return tokenData;
    }

    function logOut() {
      token.destroy();
      $log.debug("Logged out…");
    }

    function isLoggedIn() {
      return (token.retrieve() != null);
    }

    function logIn(data) {
      var promise = $http({
        method: 'POST',
        url:    '/api/token',
        data:   data
      })
      .then(
        // if the request succeeded, then run this
        // handler, and pass on the decoded token.
        function(res) {
          token.store(res.data.token);
          return token.decode();
        }
        // since there is no error handler, pass
        // an error on to the next promise, without
        // calling the above success handler
        // , function(err) { null; }
      );

      return promise;
    }
  }

})();
