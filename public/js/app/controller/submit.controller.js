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
    vm.ExistingUser = {
      email: "",
      password: ""
    };
    vm.submitSignIn = submitSignIn;
    vm.NewUser = {
      email: "",
      name: "",
      password: "",
      password_confirmation: ""
    };
    vm.submitSignUp = submitSignUp;
    vm.submitSignOut = submitSignOut;

    //FUNCTIONS
    function submitSignUp() {
      $log.info("Signing Up: ");

      userService
      .create(vm.NewUser)
      .then(function(res) {
        $log.info("success!", res.data)
        return authService.logIn(vm.NewUser)
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
        .logIn(vm.ExistingUser)
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

    function submitSignOut() {
      authService.logOut();
      $state.go('landing');
    }

  }
})();
