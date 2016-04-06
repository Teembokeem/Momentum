(function() {
  'use strict'

  angular
    .module("Momentum")
    .controller("NavController", NavController);

  NavController.$inject = ["$log", "tokenService"];

  function NavController($log, tokenService) {
    var vm = this;
    vm.user = tokenService.decode();
    $log.info("NavController Loaded")
  }

})();
