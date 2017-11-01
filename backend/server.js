const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Document = require('../models/Document');
var session = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.password === password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(express.static("public"));
app.use(session({ secret: "cats and dogs" }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Example route
app.get('/', function (req, res) {
  console.log('get /');
  res.render('Text');
});

app.get('/home', function(req, res){
  res.status(200).send({"success": true});
});

app.get('login', function(req, res){
  res.status(400).json({"success": false, "error": "Invalid username or password"});
});

app.post('/save', function(req, res){
  Document.findById(req.body.docId, function(error, result){
    result.title = req.body.docName;
    return result.save()
  })
  .then(() =>
    res.status(200).json({"success": true})
  )
  .catch((error) =>{
    res.status(500).json({"success": false, "error": error})
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password.' })
);

app.post('/register', function(req, res){
    console.log('posting to register', req.body)
  var newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(error){
    if (error){
        console.log('error: ', error)
      res.status(500).json({"success": false, "error": "Error saving"});
    } else {
      res.status(200).send({"success": true});
    }
  });

});

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
