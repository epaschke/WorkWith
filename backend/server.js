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

app.use(express.static("public"));
app.use(session({ secret: "cats and dogs" }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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

// Example route
app.get('/', function (req, res) {
  console.log('get /');
  res.render('Text');
});

app.post('/login', passport.authenticate('local'), function (req, res) {
  if (!req.user) {
    res.status(400).json({"success": false, "error": "Invalid username or password"});
  } else {
    res.status(200).send({"success": true});
  }
});

app.post('/newDocument', function(req, res){
  var newDocument = new Document({
    author: req.user._id,
    title: req.body.title
  });
  newDocument.save(function(error, nd){
    if(error){
      console.log('error: ', error);
      res.status(500).json({"success": false, "error": "Error saving document"});
    } else {
      req.user.documents.push(newDocument);
      req.user.save(function(err){
        if(err){
          console.log('error saving req.user.');
        }  else{
          console.log('saved user.');
          res.status(200).send({"success": true, doc: nd});
        }
      });
    }
  })
})

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

app.get('/documents', function(req, res){
  Document.find({}).
  populate('author').
  exec(function(err, documents){
    if(err){
      console.log('error: ', err);
      res.status(500).json({"success": false, "error": "Error finding documents"});
    }  else {
      if (documents.length === 0){
        documents = [];
      } else {
        documents = documents.filter(function(document){
          if(document.author.username === req.user.username || (document.collaborators.indexOf(req.user) > -1)){
            console.log(document);
            return true;
          } else {
            return false;
          }
        })
      }
      res.status(200).json(documents);
    }
  });
})

app.get('/document/:id', function(req, res){
  console.log('id: ', req.params.id);
  Document.findById(req.params.id, function(err, doc){
    if(err || !doc){
      console.log('document not found!');
      res.status(500).json({"success": false, "error": "Error finding document"});
    }  else {
      doc.collaborators.push(req.user);
      doc.save(function(err){
        if(err){
          console.log('error saving doc.');
        }  else{
          res.status(200).json(doc);
        }
      })
    }
  })
});

app.post('/register', function(req, res){
  User.find({username: req.body.username}, function(err, user){
    if(user.length === 0){
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      newUser.save(function(error){
        if (error){
          console.log('error: ', error)
          res.status(500).json({"success": false, "error": "Error saving user"});
        } else {
          res.status(200).send({"success": true});
        }
      });
    }  else {
      res.status(400).json({"success": false, "error": "User with that name already exists."});
    }
  })
});


app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
