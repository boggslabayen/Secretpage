require('dotenv').config()
// syntax above is needed to use environment variables to keep secret. An NPM must be installed before writing this code then create an .env file
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.SECRET);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


// attached this code below to encrypt password. When using a dotenv to encrypt, follow "process.env.SECRET"
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

// Below is for the post method on the registrtaion route

app.post("/register", function(req, res) {

  const userName = req.body.username;
  const password = req.body.password;

  const userEntry = new User({
    email: userName,
    password: password
  });

  userEntry.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }
  });

});

// Below is the post method for the login route to allow users to login
app.post("/login", function(req,res){

  User.findOne(
    {email:req.body.username},

    function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === req.body.password){
            res.render("secrets");
          }
        }
      }
  });


});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
