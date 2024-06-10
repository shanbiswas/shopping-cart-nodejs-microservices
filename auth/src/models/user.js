const mongoose = require("mongoose");
const { Password } = require("../services/password");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;

      // delete ret._id;
      // delete ret.password;
    },
    versionKey: false
  }
});

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
      this.password = await Password.toHash(this.password);
  }
});

// userSchema.statics.build = (attr) => {
//   return new User(attr);
// }

const User = mongoose.model('User', userSchema);

module.exports = User;