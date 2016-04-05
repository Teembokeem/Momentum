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
        templateUrl: "js/app/templates/submit.html",
        controller: "SubmitController",
        controllerAs: "vm"
      })
      .state("submit.signin", {
        url: "/signin",
        templateUrl: "js/app/templates/submit.signin.html"
      })
      .state("submit.signup", {
        url: "/signup",
        templateUrl: "js/app/templates/submit.signup.html"
      })
      .state("moment", {
        url: "/moment",
        templateUrl: "js/app/templates/moment.html",
        controller: "MomentController",
        controllerAs: "vm",
        authorized: true
      })
      .state("moment.create", {
        url: "/create",
        templateUrl: "js/app/templates/moment.create.html"
      })
      .state("moment.show", {
        url: "/{id}",
        templateUrl: "js/app/templates/moment.create.html"
      });

    $urlRouterProvider.otherwise("/");
  }

  angular
    .module("Momentum")
    .run(authorizeRoutes); // Register the following function to run
                           // AFTER the above configuration.

  // $state and authService you know. $rootScope is different. It's
  // the shared "scoping" object which is inherited by all bindings
  // ($scope or vm) anywhere in the app. If you add something to
  // $rootScope, it's like adding it to EVERY "vm" (view-model, ie
  // template-controller binding), directive, filter, etc. in the app.
  authorizeRoutes.$inject = ["$state", "authService", "$rootScope", "$log"];

  function authorizeRoutes($state, authService, $rootScope, $log) {

    // $on is the Angular event listener: we are telling Angular to
    // listen to any $stateChangeStart events triggered in our app!
    $rootScope.$on("$stateChangeStart", function(event, toState) {
      $log.info("state change detected")
      // Check the new state's "authorized" property, which is not built
      // in to ui-router, it just happens to match the property I added
      // to the state definition on line #25 above!
      if (toState.authorized && !authService.isLoggedIn()) {
        $log.debug(`Attempted to go to ${toState.url} but was not logged in.`);
        $state.go("submit.signin");    // Go here immediately, and
        event.preventDefault(); // do not let the event continue.
      }
    });
  }
})();
