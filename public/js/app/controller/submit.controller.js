(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("SubmitController", SubmitController);

  SubmitController.$inject = ["$log", "authService", "userService", "$state"];

  function SubmitController($log, authService, userService, $state) {
    var vm = this;
    $log.debug("SubmitController Loaded.");
    vm.toggleValue = true;
    vm.conflict;
    var TOKEN_KEY = "moment_token"

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
      $log.info("Signing Up: ");

      userService
      .create(vm.testNewUser)
      .then(function(res) {
        $log.info("success!", res.data)
        return authService.logIn(vm.testNewUser)
      })
      .then(
        function(decodedToken) {
          $log.info('Logged In!', decodedToken);
          $state.go('moment');
        }, function(err) {
        $log.info(err)
        if (err.status === 409) vm.conflict = "emailError";
        }
      );
    };

    function submitSignIn(data) {
      $log.info("Logging In:");

      authService
        .logIn(vm.testExistingUser)
        .then(
          function(decodedToken) {
            $log.info("success!", decodedToken);
            $state.go("moment");
          }, function(err) {
            $log.info(err);
            if (err.status === 403) vm.conflict = "passwordError";
          }
        );
    }

  }
})();
