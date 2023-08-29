//requiring the modules we need
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const path = require('path');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//setting up the express app
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.locals._ = _;

//for using ejs
app.set('views', path.join(__dirname + '/public/views'));
app.set('view engine', 'ejs');

//MongoDB -> Connections, Schemas, Models & Documents
//create a new database into mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/dJBlogDB');

//SCHEMAS
const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: {
    type: Date, 
    default: Date.now,
    get: (date)=> date.toLocaleDateString("en-GB") // getter
   }
});

//MODELS
const Post = mongoose.model('Post', postSchema);

//DOCUMENTS


//creating "/" route to render our home page
app.get("/", (req, res) => {
  Post.find()
    .then(allPosts => {
      //render the home.ejs file
      res.render('home', {
        homeCont: homeStartingContent,
        postsComposed: allPosts
      });
    })
    .catch(err => { console.log(`Something went wrong at app.get("/") request regarding Post.find(). \nError is: ${err}`) });
});

//creating "/about" route to render our about page
app.get("/about", (req, res) => {
  //passing "aboutCont" value into rendering page
  res.render("about", {aboutCont: aboutContent});//key="aboutCont", value="aboutContent"
});

//creating "/contact" route to render our contact page
app.get("/contact", (req, res) => {
  res.render("contact", {contactCont: contactContent});
});

//creating "/compose" route to render our compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});

//change the name of the URL dynamically depending on each article's name
app.get("/posts/:postId", (req, res) => {
  const requestedPostID = req.params.postId;
  //console.log(`requestedPostID: ${requestedPostID}`);

  Post.findById({ _id: requestedPostID })
    .then((matchedPost) => {
      //render the post.ejs file
      res.render("post", {
        postTitle: matchedPost.title,
        postBody: matchedPost.body,
        postDate: matchedPost.date
      });
    })
    .catch(err => {
      console.log(`Something went wrong at app.get("/posts/:postHeading") request regarding Post.find(). \nError is: ${err}`);
    });
});

//POST
//handle what should happen when the page makes a POST request to the compose route
app.post("/compose", (req, res) => {
  const postName = req.body.postTitle;
  const postContent = req.body.postBody;
  const postDate = new Date();
  
  //take the input data from the form using body-parser module
  const post = new Post ({
    title: postName,
    body: postContent,
    date: postDate
  });

  post.save();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
