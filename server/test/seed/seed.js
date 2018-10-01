const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const testTodos = [
  {
    _id: new ObjectID(),
    text: "first test insert"
  },
  {
    _id: new ObjectID(),
    text: "second test insert",
    completed: true,
    completedAt: 555
  }
];

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

const testUsers = [
  {
    _id: userOneId,
    password: "userOnePass",
    email: "test1@test.si",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, "secret").toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "test2@test.si",
    password: "userTwoPass"
  }
];

const populateTodos = done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(testTodos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.deleteMany({})
    .then(() => {
      let userOne = new User(testUsers[0]).save();
      let userTwo = new User(testUsers[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  testTodos,
  populateTodos,
  testUsers,
  populateUsers
};
