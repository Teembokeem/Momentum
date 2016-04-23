var User = require('../models/user');


module.exports = {
  create: create,
  index:  read,
  put:    update,
};

function create(req, res, next) {
  User.findById(req.decoded._id).exec()
    .then(
      function(user) {
        user.moments.push({
          title:         req.body.title,
          text:          req.body.text,
          images:        req.body.images,
          constellation: req.body.constellation
        });
        user.save(function(err, response) {
          console.log("Successfully Saved", response);
          console.log("Errors Detected:",   err);
          res.json({
            success: "Successfully Saved",
            moment:  response.moments[response.moments.length - 1]
          });
        });
      },
      function(err) {
        console.log("No user exists in the database", err);
      }
    );
};

function read(req, res, next) {
  User.findById(req.decoded._id).exec()
    .then(
      function(user) {
        res.json({
          moments: user.moments
        });
      },
      function(err) {
        console.log("Errors detected:", err);
      }
    );
};


function update(req, res, next) {
  User.findById(req.decoded._id).exec()
    .then(
      function(user) {
        var targetMoment = user.moments.filter(function(moment) {
          return moment._id.toString() === req.body._id.toString()
        });
        targetMoment[0].title  = req.body.title;
        targetMoment[0].text   = req.body.text;
        targetMoment[0].images = [];
        req.body.images.forEach(function(image, index) {
          targetMoment[0].images.push(image);
        });
        user.save(function(err, response) {
          if (err) console.log(err);
          console.log("succesffuly saed user", res.data)
          res.json({
            success: "yayyyyyyy",
            data: res.data
          });
        })
      },
      function(err) {
        console.log(err);
      }
    );
}

