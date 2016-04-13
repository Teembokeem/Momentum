(function() {
  'use strict'

  angular
    .module("Momentum")
    .controller("NavController", NavController);

  NavController.$inject = ["$log", "tokenService", "authService", "$state"];

  function NavController($log, tokenService, authService, $state) {
    var vm = this;
    vm.user = tokenService.decode();
    vm.authService = authService;
    $log.info("NavController Loaded")

    vm.submitSignOut = submitSignOut;

    function submitSignOut() {
      authService.logOut();
      $state.go('landing');
    }
  }

})();
