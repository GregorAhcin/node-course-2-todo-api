const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

let message = "test string 2";
let hash = SHA256(message).toString();

console.log(message);
console.log(hash);

let data = {
  id: "2"
};

let token = {
  data,
  hash: SHA256(JSON.stringify(data) + "secret1").toString()
};

data.id = "0";

let resultHash = SHA256(JSON.stringify(token.data) + "secret1").toString();

if (resultHash === token.hash) {
  console.log("Data was not changed.");
} else {
  console.log("Be cerfull. Data has changed.");
}

let tokenJWT = jwt.sign(data, "secret2");
console.log("token: ", tokenJWT);
console.log(
  "decoded token: ",
  jwt.decode(tokenJWT),
  "decoded iat or timestamp",
  new Date(jwt.decode(tokenJWT).iat * 1000)
);

let resultHashJWT = jwt.verify(tokenJWT, "secret2");

console.log(resultHashJWT);
