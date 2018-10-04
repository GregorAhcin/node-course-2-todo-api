const mongoose = require("mongoose");
const validator = require("validator");

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
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {
  Todo
};
