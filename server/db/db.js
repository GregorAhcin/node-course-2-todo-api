const mongoose = require("mongoose");

mongoose.Promise = global.Promise; // v mongoose 5.0 ta vrstica ni potrebna

mongoose.connect(
  "mongodb://localhost/TodoApp",
  { useNewUrlParser: true }
);

module.exports = {
  mongoose
};
