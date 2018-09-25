require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { User, Todo } = require("./models/models");
const { mongoose } = require("./db/db");

let app = express();
let port = process.env.PORT;

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

app.delete("/todos/:id", (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndDelete(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.patch("/todos/:id", (req, res) => {
  let id = req.params.id;

  let body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send({});
      }

      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Connected on port ${port}.`);
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
