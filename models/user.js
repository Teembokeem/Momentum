var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var Moments = new mongoose.Schema({
  title: String,
  text:  String,
  createdAt: {type: Date, default: Date.now},
  slug: String,
  images: [{type: String}],
  isPublished: {type: Boolean, default: false},
  publishedAt: {type: Date},
  constellation: []
});


var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name:  { type: String, required: true },
  moments: [Moments]
});

// Add bcrypt hashing to model (works on a password field)!
userSchema.plugin(require('mongoose-bcrypt'));

userSchema.options.toJSON = {
  transform: function(document, returnedObject, options) {
    delete returnedObject.password;
    return returnedObject;
  }
};

var User = mongoose.model('User', userSchema);

module.exports = User;
