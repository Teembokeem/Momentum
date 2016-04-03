(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("SubmitController", SubmitController);

  SubmitController.$inject = ["$log", "$http", "$window"];

  function SubmitController($log, $http, $window) {
    var vm = this;
    $log.debug("SubmitController Loaded.");
    vm.toggleValue = true;
    vm.conflict;
    const TOKEN_KEY = "moment_token"

    //BINDINGS
    vm.testExistingUser = {
      email: "tim@email.com",
      password: "123"
    };
    vm.submitSignIn = submitSignIn;
    vm.testNewUser = {
      email: "tim@email.com",
      name: "teembo",
      password: "123",
      password_confirmation: "123"
    };
    vm.submitSignUp = submitSignUp;

    //FUNCTIONS
    function submitSignUp() {
      $log.debug("Signing Up: ");

      $http({
        method: "POST",
        url: "/api/users",
        data: vm.testNewUser
      })
      .then(function(res) {
        $log.debug("success!", res.data)
      }, function(err) {
        $log.debug(err)
        if (err.status === 409) vm.conflict = "emailError";
      });
    };

    function submitSignIn() {
      $log.debug("Logging In:");

      $http({
        method: "POST",
        url: "api/token",
        data: vm.testExistingUser
      })
      .then(function(res) {
        $log.debug("success!", res.data);
        $window.localStorage.setItem(TOKEN_KEY, res.data.token)
      }, function(err) {
        $log.debug(err);
        if (err.status === 403) vm.conflict = "passwordError";
      });
    }

  }
})();
