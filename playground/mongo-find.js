const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect(
  "mongodb://localhost/",
  (err, client) => {
    if (err) {
      return console.log("Cant connect to database.");
    }
    const db = client.db("TodoApp");

    console.log("Connected to database.");

    // SETUP DATABASE QUERY:

    // db.collection("Todos")
    //   .find({
    //     // completed: true
    //     _id: new ObjectID("5ba008ea1b21961b40d058a4")
    //   })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log("Todos: ");
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     err => {
    //       console.log("Cant find data.", err);
    //     }
    //   );
    // db.collection("Todos")
    //   .count()
    //   .then(
    //     count => {
    //       console.log(`Todos count ${count}`);
    //     },
    //     err => {
    //       console.log("Cant count from database.", err);
    //     }
    //   );

    db.collection("Users")
      .find({
        name: "Gregor"
      })
      .toArray()
      .then(
        docs => {
          console.log(JSON.stringify(docs, undefined, 2));
        },
        err => {
          if (err) {
            console.log(`Error: ${err}`);
          }
        }
      );
    client.close();
  }
);
