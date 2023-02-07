const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var mongoose = require("mongoose");

const path = require('path');
const app = express();
const port = 3002;

//____________________________________________________________

var UserList = [{ username: 'test', password: '1234' },
{ username: 'ObiWan', password: 'force4ever' },
{ username: 'Spock', password: 'LiveLong_Prosper' }
];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//____________________________________________________________

// app.use
app.use("/", express.static(path.join(__dirname, '/public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(bodyParser.urlencoded({extend: false}));
app.use(passport.initialize());

//____________________________________________________________

var UserSchema = mongoose.Schema({
  username: String,
  password: String
});

UserSchema.methods.getUser = function () {
  return this.username;
}

UserSchema.methods.getPass = function () {
  return this.password;
}

//____________________________________________________________

var UserModel = mongoose.model("auth", UserSchema);

//____________________________________________________________

// the link below contained username and password of mongodb database,so we decide it to remove it out of the link.
// the login functionality won't work because username and password it removed from the link.
// I assure you that the login functonality is working.
mongoose.connect("mongodb+srv://@cluster0.yojgc.mongodb.net/users?retryWrites=true&w=majority"); 


//____________________________________________________________

// login pages
passport.use("local", new LocalStrategy(
  async function (user, pass, done) {
    var Info;
    try {
      // var user = req.body.username;
      // var pass = req.body.password;

      console.log(user + " " + pass);

      Info = await UserModel.findOne({ username: user, password: pass });

      if (Info === undefined || Info == null) {
        console.log(Info);
        return done(null, false, { message: "Info null user." });
      }
      if (Info.username === undefined || Info.username == null) {
        return done(null, false, { message: "Incorrect username." });
      }

      if (Info.password !== pass) {
        return done(null, false, { message: "Incorrect password." });
      }

      console.log("Welcome user " + Info.username + ".");
      return done(null, Info);

    } catch (e) {
      console.log(e);
    }
  }
));

// login post
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/relogin",
  session: false
}));

//____________________________________________________________

// login page
app.get("/login", function (req, res) {
  res.render("login")
});

//____________________________________________________________

// relogin page
app.get("/relogin", function (req, res) {
  res.render("relogin")
});

//____________________________________________________________

// signup fail page
app.get("/signupFail", function (req, res) {
  res.render("signupFail")
});

//____________________________________________________________

async function signUpPost(req, res) {
  var user = req.body.username;
  var pass = req.body.password;
  let userDoc = new UserModel({ username: user, password: pass });
  let userCheck = await UserModel.findOne({ username: user });

  if (userCheck == null) {
    userDoc.save();
    res.redirect("http://localhost:3002/");
  } else {
    res.render("signupFail");
  }
};

// signup post
app.post("/signup", signUpPost);

//____________________________________________________________

// signup page
app.get("/signup", function (req, res) {
  res.render("signup")
});

//____________________________________________________________

// index
app.get("/", function (req, res) {
  res.render("index")
});

//____________________________________________________________

// about page
app.get("/about", function (req, res) {
  res.render("about")
});

//____________________________________________________________


app.get("/", function (req, res) {
  res.render("index")
});
app.get("/omelette", function (req, res) {
  res.render("omelette");
});
app.get("/recipe", function (req, res) {
  res.render("recipe", { title: "Test Title", prep_time: 5, cook_time: 10, servings: 4, ingredients: ["1 bag Tyson dino chicken nuggets", "1 cup ranch", "3 tablespoons Frank's hot sauce"], steps: ["Preheat oven to 425F.", "Mix together ranch and hot sauce.", "Spread nuggets on a sheet tray and place into the oven.", "Cook for 15-18 minutes until golden brown.", "Remove the nuggets from the oven and serve with dipping sauce."] });
});

app.get("/tos", function (req, res) {
  res.render("tos");
});

app.get("/contacts", function (req, res) {
  res.render("contacts");
});

// print in console
app.listen(port, function () {
  console.log(`server running on http://localhost:${port}`);
});

//____________________________________________________________

module.exports = app;