const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const Post = require('../models/Post');

/* GET users login. */
router.get('/login', (req, res) => {
  res.render('login');
});

/* GET users register. */
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Handle
router.post('/register', (req, res) => {
  const { user, name, email, password, password2 } = req.body;

  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please fill in all fields"
    });
  }

  // Check passwords match
  if (password2 !== password) {
    errors.push({
      msg: "Passwords do not match"
    })
  }

  // Check password length
  if (password.length < 6) {
    errors.push({
      msg: "Password should be al least 6 characters"
    })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        // User exist
        errors.push({
          msg: 'Email is already registered'
        });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err))
            }))
      }
    });
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// SendMessage Handle
router.post('/message', (req, res) => {
  // Validation
  const { name, message } = req.body;

  if (req.body.message.length > 200) {
    res.send({error: 'Fooo'})
  } else {
    console.log('F', req.body);
    // Add message
    const newPost = new Post({
      name,
      message
    });
    newPost.save();

    res.end()
  }
});

router.get('/messages', (req, res) => {
  console.log('messages', req.body);
  Post.find({}, (err, posts) => {
    if(err) throw err;
    res.send({posts} );
  });

});


module.exports = router;
