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
      })
      .state("moment", {
        url: "/moment",
        templateUrl: "js/app/templates/moment.html",
        controller: "MomentController",
        controllerAs: "vm"
      })
      .state("moment.create", {
        url: "/create",
        templateUrl: "js/app/templates/moment.create.html"
      });

    $urlRouterProvider.otherwise("/");
  }

})();
