const mongoose = require("mongoose");

mongoose.Promise = global.Promise; // v mongoose 5.0 ta vrstica ni potrebna

mongoose.connect("mongodb://localhost/TodoApp");

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

let novTodo = new Todo({
  text: "go home"
});

novTodo.save().then(
  doc => {
    console.log("Saved to database: ", doc);
  },
  e => {
    console.log("Cant save to database", e);
  }
);

let novejsiTodo = new Todo({
  text: "My bad not going to church.",
  completed: false,
  completedAt: 2
});

novejsiTodo.save().then(
  doc => {
    console.log(doc);
  },
  e => {
    console.log("error has happend");
  }
);

let User = mongoose.model("User", {
  email: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 55
  }
});

let novUser = new User({
  email: "bubi.grega@gmail.com"
});

novUser.save().then(
  doc => {
    console.log(doc);
  },
  e => {
    console.log(e);
  }
);
