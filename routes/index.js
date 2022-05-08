var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require("./users.js")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

router.post('/reg', function(req, res) {
  const dets = new userModel({
    name: req.body.name,
    username: req.body.username,
    email : req.body.email,
  });

  userModel.register(dets, req.body.passport).then(function (registeredUser) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile")
    });
  });

});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

router.get("/profile", isLoggedIn, (req, res) => {
  userModel.findOne({username: req.session.passport.user})
  .then(function(user) {
    res.render('profile', {user});
  });
});

const localStrategy = require('passport-local');
const res = require('express/lib/response');
passport.use(new localStrategy(userModel.authenticate()));

module.exports = router;

// https://drive.google.com/file/d/1zIXsoDbiXx5xgkrwuyhoZ7LP-QHslim/view