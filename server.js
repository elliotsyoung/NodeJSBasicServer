// Initialization and imports ##########
const express = require('express');
const app = express();
// END OF Initialization and imports ######################

// Database setup ##########
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/jethro");
const database = mongoose.connection;
database.once("open", ()=> {
  console.log("Connected to the database");
})
// END OF Database setup ######################

// Mongoose tests ##########
var Schema = mongoose.Schema;

var PostsSchema = new Schema({
  name: String,
  text: String
});

// Compile model from schema
var PostsModel = mongoose.model('posts', PostsSchema );


// END OF Mongoose tests ######################



// Middleware ##########
app.set("view engine", "ejs");
app.use( express.urlencoded({extended:false}) );
// END OF Middleware ######################

// Routes ##########
app.get("/", (req, res) => {
  const randomNumber = Math.random() * 10;

  PostsModel.find({}).exec((err, data) => {
    if (err) {
      res.send("There was an error in the database");
    } else{
      console.log(data);
      res.render('index.ejs', {posts: data.reverse()});
    }
  });
});

app.post("/createwallpost", (req, res) => {

  const newPost = new PostsModel(req.body)

  newPost.save((err) => {
    if(err){
      console.log(err);
      res.send("There was an error inserting the document into the database.")
    } else {
      console.log("Document successfully inserted.");
      res.redirect('/');
    }
  });

});
// END OF Routes ######################

// Turn on server
app.listen(3000);
