const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost/",
  (err, client) => {
    if (err) {
      return console.log("Cant connect to database.");
    }
    console.log("Connected to database.");

    const db = client.db("TodoApp");

    db.collection("Todos")
      .findOneAndUpdate(
        {
          _id: new ObjectID("5ba008ea1b21961b40d058a4")
        },
        {
          $set: {
            completed: true
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(result => {
        console.log(result);
      });

    db.collection("Users")
      .findOneAndUpdate(
        { _id: new ObjectID("5ba11abe5808e81170df53d5") },
        {
          $set: { name: "Gregor" },
          $inc: { age: +1 }
        },
        {
          returnOriginal: false
        }
      )
      .then(result => {
        console.log(result);
      });

    client.close();
  }
);
