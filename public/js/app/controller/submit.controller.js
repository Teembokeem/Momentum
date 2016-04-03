(function() {
  "use strict";

  angular
    .module("Momentum")
    .controller("SubmitController", SubmitController);

  SubmitController.$inject = ['$log'];

  function SubmitController($log) {
    var vm = this;
    $log.debug("SubmitController Loaded.")
  }
})();
