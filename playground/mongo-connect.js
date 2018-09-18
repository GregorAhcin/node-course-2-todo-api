const { MongoClient, ObjectID } = require("mongodb");

let obj = new ObjectID();
console.log(obj);

MongoClient.connect(
  "mongodb://localhost:27017",
  (err, client) => {
    if (err) {
      return console.log("unable to connect to mongo db");
    }
    console.log("Connected to MongoDB server.");

    const db = client.db("TodoApp");

    // db.collection("Todos").insertOne(
    //   {
    //     text: "Something to do",
    //     complete: false
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.log("unable to insert todo");
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //   }
    // );

    db.collection("Users").insertOne(
      { name: "Gregor", age: 40, location: "Ljubljana" },
      (err, result) => {
        if (err) {
          return console.log("unable to connect to database");
        }

        console.log(
          JSON.stringify(result.ops, undefined, 2),
          "\n",
          result.ops[0]._id.getTimestamp(),
          "\n",
          result.ops[0]._id
        );
      }
    );

    client.close();
  }
);

/* OBJECT ID _id:
  -timestamp 
  -machine id
  -process id
  -random number
preberes Object id: result.ops[0]._id
preberes Object timestemp: result.ops[0]._id.getTimestamp()
  object id USTVARIS: let obj = new ObjectID();
*/
