var express = require('express'),
    router  = new express.Router();

// Require controllers.
var usersCtrl = require('../controllers/users');
var MomentController = require('../controllers/moment');

// Require token authentication.
var token = require('../config/token_auth');

// users resource paths:
router.post('/users',    usersCtrl.create);
router.get( '/users/me', token.authenticate, usersCtrl.me);
router.put( '/users/me', token.authenticate, usersCtrl.update);

// token auth
router.post('/token', token.create);
router.post('/users/me/token', token.authenticate, token.refresh);

// moment paths:
router.get('/users/me/moments', token.authenticate, MomentController.index);
router.get('/users/me/moments/:id', token.authenticate, MomentController.show);
router.post('/users/me/moments', token.authenticate, MomentController.create);
router.put('/users/me/moments/:id', token.authenticate, MomentController.put);
router.delete('/users/me/moments/:id', token.authenticate, MomentController.delete);

module.exports = router;
