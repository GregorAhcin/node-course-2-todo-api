const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

const { User, Todo } = require("./models/models");
const { mongoose } = require("./db/db");

let app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/:id", (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.listen(3000, () => {
  console.log("Connected on port 3000.");
});

module.exports = {
  app
};

// MONGOOSE WRITES TO DATABASE

// let novUser = new User({
//   email: "bubi.grega@gmail.com"
// });

// let novTodo = new Todo({
//   text: "go home"
// });

// novTodo.save().then(
//   doc => {
//     console.log("Saved to database: ", doc);
//   },
//   e => {
//     console.log("Cant save to database", e);
//   }
// );

// let novejsiTodo = new Todo({
//   text: "My bad not going to church.",
//   completed: false,
//   completedAt: 2
// });

// novejsiTodo.save().then(
//   doc => {
//     console.log(doc);
//   },
//   e => {
//     console.log("error has happend");
//   }
// );

// novUser.save().then(
//   doc => {
//     console.log(doc);
//   },
//   e => {
//     console.log(e);
//   }
// );
