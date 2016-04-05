// (function() {
//   "use strict";

//   angular
//     .module("app")
//     .config(appRoutes);

//   appRoutes.$inject = ["$urlRouterProvider", "$stateProvider"];

//   function appRoutes($urlRouterProvider, $stateProvider) {
//     $stateProvider
//       .state("welcome", {
//         url:         "/",
//         templateUrl: "/js/app/layouts/welcome.html"
//       })
//       .state("signin", {
//         url:          "/signin",
//         templateUrl:  "/js/app/auth/signin.html",
//         controller:   "SignInController",
//         controllerAs: "vm"
//       })
//       .state("profile", {
//         url:          "/profile",
//         templateUrl:  "/js/app/users/profile.html",
//         controller:   "ProfileController",
//         controllerAs: "vm",
//         authorized:   true
//       });

//     $urlRouterProvider.otherwise("/");
//   }


