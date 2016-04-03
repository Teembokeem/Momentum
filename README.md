<<<<<<< HEAD
# MEAN Starter Code

...
=======
# Ng Auth App Walkthru

## Starter Code / Initial Commit

For now:

> **We begin with the first refactoring and users stories 1.1, 1.2, 2.1
> and 2.2 complete.**

## User Stories 1

> Note: to be completed. We did these in class, and they're in this code,
> but I want to add them as commits w/comments too. Fingers crossed :v:!

## Refactoring 1

- [x] Shared behavior around the **token** (`tokenService`):
  - [x] store it,
  - [x] read/retrieve it,
  - [x] decode it with an [outside library][jwt] __&#42;__, 
  - [x] and destroy it.
- [x] Shared behavior and data around **auth** (authentication/authorization)
      in a single `authService` that encapsulates our token logic:
  - [x] authenticate as a user, ie *log in*,
  - *more to be added below…*
- [x] Shared behavior around the **user resource** (`userService`):
  - [x] creating a user,
  - *more to be added below…*

__&#42;__ — *For working with JWTs, see also: [`angular-jwt`][ng-jwt].*

## User Stories 2

##### Step One

- [x] 1.1 AAU, when I am already a registered user, I can (sign in) log in 
      w/ an email & password.
- [x] 1.2 AAU, after sign in (sign up or log in), I am immediately directed
      to the welcome page.

> Here we are going to start re-using some of the auth behavior we've 
> already written: how will that change how we see our functions?
> We also need to instigate a `ui-router` "state" change programmatically,
> ie **not** from a user interacting with a `ui-sref` directive. We also

##### Step Two

- [x] 2.1 AAU, when I try to sign up (create a user) with an email that is 
      taken, I will be alerted about this.
      - [x] *Must wireframe first…*
- [x] 2.2 AAU, when I'm authenticated, I see a sign out button in the navbar.
- [x] 2.3 **AAU, when I am logged in and click on the "Sign out" button, I 
      log out of the application.** (First/second commit!)
- [x] 2.4 **AAU, when I log out I am redirected back to the Welcome page.**
      (Third commit!)

> Here we are going to update the user based on some information from
> the server, specifically a certain type of failed request. We will
> also render conditionally based on our auth status.

##### Step Three

- [x] 3.1 AAU, when I am signed in, I see a profile button in the navbar.
- [x] 3.2 AAU, when I click on the profile button, I go to the profile page.
- [x] 3.3 AAU, when I am not *logged in*, if I try to go to the profile page,
      I will be redirected to the signin page.

> Here we will protect certain states as a whole by authorizing them.
> In order to authorize them, we need to [*run* a configuration][run]
> that registers a listener to our state changes, and attach to states
> [custom data][custom-data] to mark them as authorized.

*For packaging a configuration "run block," in this case, we will break 
the "one component per file" rule!*

##### Step Four

- [x] 4.1 AAU, when I am on the profile page, I see an update form.
- [x] 4.2 AAU, I can update my user info.
  - [x] 4.2a Update user info on the server.
  - [x] 4.2b Update user info in the token (by generating a new token…).
- [x] 4.3 AAU, if I try to update my user info, but I am not *logged in*,
      I will be redirected to the signin page.

> Here we will make an authenticated request: in order to do this we
> will need to edit our request headers.

## Refactoring 2

- [x] Now that we have a working profile page, let's redirect the users
      there instead of the welcome page when they log in!
- [x] Create a special type of service that will set the headers 
      automatically on every request, [called an interceptor][interceptors].
      - [x] Add Content-Type headers.
      - [x] Add Authorization headers when logged in.
- [x] Use interceptors to handle certain types of 
      responses or errors: specifically for us, 401/403 auth errors.
- [x] Turn all logging into `$log.debug()` so that we can turn it on in
      development, or off in production!
- [x] Folder structure: *we should have been doing this from the get-go*,
      but better late than never, I say!

## Ice Box

- [ ] AAU, if I try to update my profile to have an email that is taken,
      I will be alerted.
- [ ] AAU, when I click on *Forgot my password*, I get a notification to
      change it.
  - [ ] *Must wireframe first…*

<!-- Links -->

[jwt]:          https://github.com/auth0/jwt-decode
[ng-jwt]:       https://github.com/auth0/angular-jwt
[interceptors]: https://docs.angularjs.org/api/ng/service/$http#interceptors
[run]:          https://docs.angularjs.org/guide/module#module-loading-dependencies
[custom-data]:  https://github.com/angular-ui/ui-router/wiki#attach-custom-data-to-state-objects
[y171]:         https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#run-blocks
>>>>>>> master
