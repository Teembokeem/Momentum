(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("SubmitController", SubmitController);

  SubmitController.$inject = ["$log", "authService", "userService, "$state"];

  function SubmitController($log, authService, userService, $state) {
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

      userService
      .create(vm.testNewUser)
      .then(function(res) {
        $log.debug("success!", res.data)
        submitSignIn(vm.testNewUser)
      }, function(err) {
        $log.debug(err)
        if (err.status === 409) vm.conflict = "emailError";
      });
    };

    function submitSignIn(data) {
      $log.debug("Logging In:");

      $http({
        method: "POST",
        url: "api/token",
        data: data
      })
      .then(function(res) {
        $log.debug("success!", res.data);
        $window.localStorage.setItem(TOKEN_KEY, res.data.token)
        $state.go("momentum")
      }, function(err) {
        $log.debug(err);
        if (err.status === 403) vm.conflict = "passwordError";
      });
    }

  }
})();
