var express = require("express");
var router = express.Router();
var User = require("../models/User");

module.exports = function (passport) {
  //RN for Admin Signup but can be later used to create account for students and teacher might use 'isAdmin' later
  router.post("/signup", function (req, res) {
    let errors = [];

    var body = req.body,
      email = body.email,
      username = body.username,
      password = body.password,
      status = body.userstatus;
      level = body.level

    if (!username || !password || !email) {
      errors.push({ msg: "Please fill in all fields" });
    }

    User.findOne({ email: email }, function (err, doc) {
      if (err) {
        res.status(500).send("error occured");
      } //mongoose or database error
      else {
        if (doc) {
          // Window.alert('Email is already Registered!\n Please login to continue!');
          res.redirect('/signup') //if user with same username already exist
        } else {
          //Create new user
          var record = new User();
          record.email = email;
          record.username = username;
          record.password = record.hashPassword(password); //access method
          record.userstatus = status;
          record.level = level
          record.save(function (err, user) {
            //Save to database
            if (err) {
              console.log(err)
              res.status(500).send("Database error occured");
            } else {
              // res.render('/admin')
              error = 'Email Already Registered!'
              res.redirect("/");
            }
          });
        }
      }
    });
  });

  //For Login using local strategy
  //   router.post(
  //     "/login",
  //     passport.authenticate("local", {
  //       failureRedirect: "/",
  //       successRedirect: "/dashboard",
  //       failureFlash: true,
  //     }),
  //     function (req, res) {
  //       res.send("Welcome");
  //     }
  //   );
  //   return router;
  // };

  

  router.post("/login", function (req, res) {
    const user = new User({
      email: req.body.username,
      password: req.body.password,
    });
    User.findOne({ email: req.body.username }, function (err, user) {
      req.login(user, function (err) {
        if (!err) {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/dashboard");
            console.log(user.email);
          });
        } else {
          res.redirect('/');
        }
      });
      req.session.user = user;
    });
  });
  return router;
};
