var express = require('express'),
    router  = new express.Router();

// Require controllers.
var UsersController = require('../controllers/users'),
    MomentController = require('../controllers/moments');

// Require token authentication.
var token = require('../config/token_auth');

// users resource paths:
router.get( '/users/me', token.authenticate, UsersController.me);
router.post('/users',    UsersController.create);
router.put( '/users/me', token.authenticate, UsersController.update);

// token auth
router.post('/token',          token.create);
router.post('/users/me/token', token.authenticate, token.refresh);

// moment paths:
router.get('/moments',     token.authenticate, MomentController.index);
router.post('/moments',    token.authenticate, MomentController.create);
router.put('/moments/:id', token.authenticate, MomentController.put);

module.exports = router;
