(function() {
  "use strict";

  angular
    .module("app")
    .controller("SignInController", SignInController);

  SignInController.$inject = ["$log", "authService", "userService", "$state"];

  function SignInController($log, authService, userService, $state) {
    var vm = this;

    // BINDINGS
    vm.signUp = {
      email:    "pj@ga.co",
      name:     "Philip Hughes",
      password: "12345",
      passwordConfirmation: "12345"
    };
    vm.submitSignUp = submitSignUp;
    vm.logIn = {
      email:    "pj@ga.co",
      password: "12345"
    };
    vm.submitLogIn = submitLogIn;
    vm.conflict = false;

    // FUNCTIONS
    function submitSignUp() {
      userService
        .create(vm.signUp)
        .then(function(res) {
          return authService.logIn(vm.signUp);
        })
        .then(
          // on success
          function(decodedToken) {
            $log.debug('Logged in!', decodedToken);
            $state.go('profile');
          },
          // on error
          function(err) {
            if (err.status === 409) vm.conflict = true;
            $log.debug('Error Claire-r:', err);
          }
        );
    }

    function submitLogIn() {
      authService
        .logIn(vm.logIn)
        .then(
          // on success
          function(decodedToken) {
            $log.debug('Logged in!', decodedToken);
            $state.go('profile');
          },
          // on error
          function(err) {
            $log.debug('Error:', err);
          }
        );
    }

    $log.debug("SignInController loaded!");
  }
})();
