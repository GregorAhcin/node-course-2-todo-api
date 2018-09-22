const mongoose = require("mongoose");

let User = mongoose.model("User", {
  email: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 55
  }
});

let Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {
  User,
  Todo
};
