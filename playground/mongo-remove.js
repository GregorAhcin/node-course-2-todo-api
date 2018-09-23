const { mongoose } = require("./../server/db/db");

const { Todo } = require("./../server/models/models");

// Todo.deleteMany({}).then(result => {
//   console.log(result);
// });

// Todo.findOneAndDelete({ _id: "5ba7f28dc1d209b925163cbb" }).then(doc => {
//   console.log(doc);
// });

Todo.findByIdAndDelete("5ba7f353c1d209b925163d84").then(doc => {
  console.log(doc);
});
