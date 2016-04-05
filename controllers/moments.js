var User = require('../models/user');


module.exports = {
  index:  index,
  show:   show,
  create: create,
  put:    put,
  delete: delete
};

function index(req, res, next) {
  console.log("hello user", req.user)
}

function show(req, res, next) {
  console.log("hello user", req.user)
}

function create(req, res, next) {
  console.log("hello user", req.user)
}

function put(req, res, next) {
  console.log("hello user", req.user)
}

function delete(req, res, next) {
  console.log("hello user", req.user)
}

