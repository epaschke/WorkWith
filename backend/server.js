const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Document = require('../models/document');
var session = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
const server  = require('http').Server(app);
const io = require('socket.io')(server);

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
      req.user.documents.push(nd);
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
  //console.log('save req:', req.body);
  Document.findById(req.body.docId, function(error, result){
    if (error || !result){
      res.status(500).json({"success": false, "error": error});
    } else {
      //console.log('result found save:', result);
      result.title = req.body.title;
      result.editorRaw = req.body.editorState;
      result.save(function(error, result2){
        if (error){
          console.log('error saving: ', error);
          res.status(500).json({"success": false, "error": error});
        } else {
          console.log('post-save: ', result2);
          res.status(200).json({"success": true});
        }
      });
    }
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
            //console.log(document);
            return true;
          } else {
            return false;
          }
        });
      }
      res.status(200).json(documents);
    }
  });
});

app.get('/finddocument/:id', function(req, res){
  //console.log('id: ', req.params.id);
  Document.findById(req.params.id, function(err, doc){
    if(err || !doc){
      console.log('document not found!');
      res.status(500).json({"success": false, "error": "Error finding document"});
    }  else {
      doc.collaborators.push(req.user._id);
      doc.save(function(err){
        if(err){
          console.log('error saving doc.');
        }  else{
          res.status(200).json(doc);
        }
      })
    }
  })
})

app.get('/document/:id', function(req, res){
  //console.log('id: ', req.params.id);
  Document.findById(req.params.id, function(err, doc){
    if(doc){
      res.status(200).json(doc);
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

io.on('connection', function(socket){
  console.log('connection made')
  socket.on('join', function(id){
    if(socket.room){
      socket.leave(socket.room);
    }

    socket.room = id;
    socket.join(id, function(){
      console.log('joined the room!');
    });
  })

  socket.on('typing', function(contentStr){
    if(!contentStr){
      return socket.emit('errorMessage', 'No content!');
    }  else if(!socket.room){
      return socket.emit('errorMessage', 'No room!');
    }  else{
      socket.to(socket.room).emit('changestate', contentStr);
    }
  })
})

server.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
