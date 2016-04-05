var User = require('../models/user');


module.exports = {
  index:  index,
  show:   show,
  create: create,
  put:    put,
  delete: destroy
};

function index(req, res, next) {
  console.log("hello user", req.user);
  User.findById(req.decoded._id).exec()
    .then(
      function(user) {
        res.json({
          moments: user.moments
      }, function(err) {
        console.log(err)
      }
    );
  })
}

function show(req, res, next) {
  console.log("hello user", req.user);

}

function create(req, res, next) {
  console.log("hello user", req.user);
  User.findById(req.decoded._id).exec()
    .then(function(user) {
      user.moments.push({
        title: req.body.title,
        text: req.body.text,
        images: req.body.images
      })
      user.save(function(err, response) {
        console.log("successfully saved", response)
        console.log("any errors?:", err)
      })
      res.json({
        success: "YASSSSS"
      })
    }, function(err) {
      console.log("no user exists", err)
    })

}

function put(req, res, next) {
  console.log("hello user", req.user);

}

function destroy(req, res, next) {
  console.log("hello user", req.user);

}

