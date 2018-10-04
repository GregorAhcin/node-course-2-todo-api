require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { User } = require("./models/user");
const { Todo } = require("./models/todo");
const { mongoose } = require("./db/db");
const { authenticate } = require("./middleware/authenticate");

let app = express();
let port = process.env.PORT;

app.use(bodyParser.json());

app.post("/user", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);

  let user = new User(body);

  user
    .save()
    .then(user => {
      //res.send(user)
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.get("/user/me", authenticate, (req, res) => {
  res.header("x-auth", req.token).send(req.user);
});

app.post("/user/login", (req, res) => {
  let body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => res.status(400).send());
});

app.delete("/user/me/token", authenticate, (req, res) => {
  req.user
    .deleteToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.post("/todos", authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({
        todos
      });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.delete("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.patch("/todos/:id", authenticate, (req, res) => {
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

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    {
      $set: body
    },
    {
      new: true
    }
  )
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
