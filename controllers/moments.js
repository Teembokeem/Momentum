var User = require('../models/user');


module.exports = {
  create: create,
  index:  read,
  put:    update,
  delete: destroy
};

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
        res.json({
          success: "YASSSSS",
          moment: response.moments[response.moments.length - 1]
        })
      })
    }, function(err) {
      console.log("no user exists", err)
    })

}

function read(req, res, next) {
  console.log("hello user", req.user);
  User.findById(req.decoded._id).exec()
    .then(
      function(user) {
        res.json({
          moments: user.moments
        });
      },
      function(err) {
        console.log(err)
      }
    );
}


function update(req, res, next) {
  console.log("hello user", req.decoded._id);
  User.findById(req.decoded._id).exec()
    .then(
      function(user) {
        // console.log("HELLO AGAIN ", user)
        var targetMoment = user.moments.filter(function(moment) {
          return moment._id.toString() === req.body._id.toString()
        });
        targetMoment[0].title = req.body.title;
        targetMoment[0].text = req.body.text;
        targetMoment[0].images = [];
        console.log("ENTERING PROMISE:", targetMoment[0])
        req.body.images.forEach(function(image, index) {
          targetMoment[0].images.push(image)
          console.log(index === req.body.images.length - 1)
          if (index === req.body.images.length - 1);
        });
        console.log("HERS YOUR IMAGES IN MOMENTS NOW", targetMoment[0])
        user.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("succesffuly saed user", res.data)
            res.json({
              success: "yayyyyyyy",
              data: res.data
            });
          }
        })
      }, function(err) {
        console.log(err);
      }
    );
}

function destroy(req, res, next) {
  console.log("hello user", req.user);

}

