(function() {
  "use strict";

  angular
    .module("Momentum")
    .config(configure);

  configure.$inject = ["$httpProvider"];

  function configure($httpProvider) {
    $httpProvider.interceptors.push("jsonHeadersService");
    $httpProvider.interceptors.push("tokenSigningService");
  }

})();
