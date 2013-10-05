// app.js

var express = require('express');
var app = express();
var mysql = require("mysql");
var htmlFilePath = "frontend/html";
var connection = mysql.createConnection(
  {
    host:"127.0.0.1",
    user:"root",
    password:"password",
    database:"nodejs",
  }
);
connection.connect();

// TODO:  Need to figure out how to include css. 
app.use(express.static("/frontend", "/css"));

// Middlewear for post methods
app.use(express.bodyParser());

app.listen(8888);

console.log("Started server");

app.get("/lab3", function(request, response) {
  response.sendfile(htmlFilePath + "/lab3.html");
});

app.get("/signup", function(request, response) {
  response.sendfile(htmlFilePath + "/signup.html");
});

app.post("/upload", function(request, response) {
  console.log("We are here");
  var email = request.body.email;
  var query = connection.query("select * from users where name = ?;", email, function(err, result) {
    if (!err) {
      if (query[0] == null) {
        response.send("This email is already in use");
      } else {
      	connection.query("INSERT into users values (default, ?);", email, function(err, result) {
          if (err) {
            response.send("There was an error trying to setup your account");
          } else {
            response.send("Successfully created an account");
          }
        });
      }
    } else {
      console.log(query.sql);
      console.log(err);
    }
  });
});

app.get("/createDB", function(request, response) {
  connection.query("CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100));");
  response.send("Created database");
});
