(function() {
  "use strict";

  angular
    .module("Momentum")
    .config(AppRoutes);

  AppRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];

  function AppRoutes($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("landing", {
        url: "/",
        templateUrl: "js/app/templates/landing.html"
      })
      .state("submit", {
        url: "/submit",
        templateUrl: "js/app/templates/signin.html",
        controller: "SubmitController",
        controllerAs: "vm"
      });

    $urlRouterProvider.otherwise("/");
  }

})();