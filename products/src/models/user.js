const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
    },
    versionKey: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;