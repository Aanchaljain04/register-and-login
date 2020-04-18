var express = require("express");


var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy= require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User= require("./models/user");


var app= express();
mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-session")({
     secret: "i am aanchal",
     resave : false,
     saveUninitialized: false

}));

app.use(function(req,res,next){
  res.locals.currentUser= req.user;
  next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//index route
app.get("/home",function(req,res){
      res.send("home");}
   );


//SHOW REGISTER FORM
app.get("/",function(req,res){
  res.render("register");
});

//HANDLING USER REGISTRATION
app.post("/",function(req,res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}),req.body.password,function(err,user){
    if(err){
      
      res.send("<a href='/login'><h1>You are already registered.Click here to go to on login page</h1></a>");
       
    }
      
    passport.authenticate("local")(req,res,function(){
      res.send("home");
    });
   });
});

//LOGIN FORM
app.get("/login",function(req,res){
  res.render("login");
});

//CHECK LOGIN CREDENTIALS IE. USERNAME AND PASSWORD
app.post("/login",passport.authenticate("local",{
  successRedirect: "/home",
  failureRedirect: "/login"
}),function(req,res){
});


app.listen(3000,function()
 {console.log("listen to 3000");
});
