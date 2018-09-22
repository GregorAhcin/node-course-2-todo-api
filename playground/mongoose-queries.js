const { mongoose } = require("./../server/db/db");
const { Todo, User } = require("./../server/models/models");

const { ObjectID } = require("mongodb");

let id = "5ba547429b3b20113e95efac";

if (!ObjectID.isValid(id)) {
  return console.log("Id was not valid");
}

Todo.find({
  _id: id
})
  .then(todos => {
    if (todos.length == 0) {
      return console.log("no todos by this id");
    }
    console.log("Todos:", todos);
  })
  .catch(e => console.log(e));

Todo.findOne({
  _id: id
})
  .then(todo => {
    if (!todo) {
      return console.log("no todos with this id");
    }
    console.log("Todo: ", todo);
  })
  .catch(e => console.log(e));

Todo.findById(id)
  .then(todo => {
    if (!todo) {
      return console.log("no todo with that id");
    }
    console.log("Todo: ", todo);
  })
  .catch(e => console.log(e));

User.findById(id)
  .then(user => {
    if (!user) {
      return console.log("no user with that id");
    }
    console.log("User: ", user);
  })
  .catch(e => console.log(e));
