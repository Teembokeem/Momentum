var express = require('express'),
    router  = new express.Router();

// Require controllers.
var usersCtrl = require('../controllers/users');

// Require token authentication.
var token = require('../config/token_auth');

// Users resource routes:
router.post('/users',    usersCtrl.create);
router.get( '/users/me', token.authenticate, usersCtrl.me);

// Token creation and refresh routes:
router.post('/token', token.create);
router.post('/users/me/token', token.authenticate, token.refresh);

module.exports = router;
