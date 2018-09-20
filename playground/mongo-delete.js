const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost/",
  (err, client) => {
    if (err) {
      return console.log("Cant connect to a server.");
    }

    console.log("Connected to server.");

    const db = client.db("TodoApp");

    // DELETE MANY

    // db.collection("Todos")
    //   .deleteMany({ text: "eat lunch" })
    //   .then(result => {
    //     console.log(result);
    //   });

    // DELETE ONE

    // db.collection("Todos")
    //   .deleteOne({ text: "eat lunch" })
    //   .then(result => {
    //     console.log(result);
    //   });

    // FIND 1 AND DELETE

    // db.collection("Todos")
    //   .findOneAndDelete({ completed: true })
    //   .then(result => {
    //     console.log(result);
    //   });

    // db.collection("Users")
    //   .findOneAndDelete({ _id: new ObjectID("5ba11a9a5d6530115eb0ff24") })
    //   .then(result => {
    //     console.log(result);
    //   });
    db.collection("Users")
      .deleteMany({ name: "Gregor" })
      .then(result => {
        console.log(result);
      });

    client.close();
  }
);
