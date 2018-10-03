const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const {
  testTodos,
  populateTodos,
  testUsers,
  populateUsers
} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todo", () => {
  it("should create new todo", done => {
    let text = "new task";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create new todo if we send empty string", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("should return all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todo by id", () => {
  it("should return todo doc", done => {
    request(app)
      .get(`/todos/${testTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(testTodos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for no object ids", done => {
    request(app)
      .get("/todos/777")
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete todo", done => {
    let hexId = testTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return 404 if todo not found", done => {
    let newId = new ObjectID();

    request(app)
      .delete(`/todos/${newId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if object id is invalid", done => {
    let id = "not_A_Valid_Id";

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update todo", done => {
    let id = testTodos[0]._id.toHexString();
    let text = "new text";
    let bool = true;

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: bool })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    let id = testTodos[1]._id.toHexString();
    let text = "test text";

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe("GET user/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/user/me")
      .set("x-auth", testUsers[0].tokens[0].token)
      .expect(200)
      .expect(response => {
        expect(response.body._id).toBe(testUsers[0]._id.toHexString());
        expect(response.body.email).toBe(testUsers[0].email);
      })
      .end(done);
  });

  it("should return an empty object if user not authenticated", done => {
    request(app)
      .get("/user/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /user", () => {
  it("should create a user", done => {
    let email = "aaaaaa@aaaa.si";
    let password = "aaaaaaaaaa";
    request(app)
      .post("/user")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.body).toNotEqual({});
        expect(res.header["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findOne({ email })
          .then(user => {
            expect(user.email).toBe(email);
            expect(user.password).toNotEqual(password);
            done();
          })
          .catch(e => done(e));
      });
  });
  it("should return validotion error if request invalid", done => {
    request(app)
      .post("/user")
      .send({ email: "aaa", password: "aa" })
      .expect(400)
      .end(done);
  });
  it("should not creat user if email in use", done => {
    request(app)
      .post("/user")
      .send({ email: testUsers[0].email, password: "aaaaaaa" })
      .expect(400)
      .end(done);
  });
});

describe("POST /user/login", () => {
  it("should login user and return auth token", done => {
    request(app)
      .post("/user/login")
      .send({
        email: testUsers[1].email,
        password: testUsers[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findOne({ _id: testUsers[1]._id })
          .then(user => {
            expect(user.tokens[0]).toInclude({
              access: "auth",
              token: res.header["x-auth"]
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return validation errors if request invalid", done => {
    request(app)
      .post("/user/login")
      .send({
        email: testUsers[1].email,
        password: "wrongpassword"
      })
      .expect(400)
      .expect(res => {
        expect(res.headers["x-auth"]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findOne({
          _id: testUsers[1]._id
        })
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
