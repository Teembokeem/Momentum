(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("MomentumController", MomentumController);

  MomentumController.$inject = ["$log"];

  function MomentumController($log) {
    $log.debug('MomentumController Loaded.')
    var vm = this;

  }
})();
