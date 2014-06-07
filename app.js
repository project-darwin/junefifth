// express and middleware modules
var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  compress = require('compression'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  request = require('request'),
  path = require('path');

// passport related modules
var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

var jade = require('jade'),
  request = require('request'),
  util = require('util'),
  mongoose = require('mongoose'),
  mongoStore = require('connect-mongo')({session: session});

// create express app
var app = express();

var env = process.env.NODE_ENV || 'dev';
if('dev' == env){
  // configure
} else if('prod' == env){
  // configure
}

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');
app.enable('jsonp callback');
app.use(morgan(env));
app.use(compress());
app.use(cookieParser('keyboard cat'));
app.use(bodyParser());
app.use(methodOverride());
app.use(session({
  secret: 'keyboard cat',
  store: new mongoStore({
    url: 'mongodb://localhost/junefifth',
    collection: 'sessions'
  }),
  proxy: false,
  cookie: {
    secure: false,
    httpOnly: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/app/components'));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize the user object based on a pre-serialized token
// which is the user id
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser')
  User.findOne({
      _id: id
  }, function(err, user) {
      done(err, user);
  });
});

// facebook clientID: 631624253598715 
// facebook clientSecret: 41c1f2cdccf65c93ff6d68ad102c65e6

var User = require('./app/models/users.js')['User'];

passport.use(new FacebookStrategy({
  clientID: '631624253598715',
  clientSecret: '41c1f2cdccf65c93ff6d68ad102c65e6',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({fbId: profile.id}, function (err, user) {
      if(err) {
        console.log(err);
        return err;
      }
      if(!user) {
        var u = new User({
          fbId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          fullName: profile.displayName,
          accessToken: accessToken,
          email: profile.emails[0].value,
          username: profile.username,
          fb: profile._json
          // picture: profile.photos,
        });
        u.save(function(err) {
          return done(err, u);
        });
      } else {
        user.fbId = profile.id;
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        user.fullName = profile.displayName;
        user.accessToken = accessToken;
        user.email = profile.emails[0].value;
        user.username = profile.username;
        user.fb = profile._json;
        user.save(function(err) {
          return done(err, user);
        });
      }
    });
  }
));

// https://apps.twitter.com/app/6095054/keys
passport.use(new TwitterStrategy({
    consumerKey: 'ci0Q6SK0f8PXtr5gYarml7biZ',
    consumerSecret: 'YW7MZm9uXYQ5JSfDtXLjkwpM4LQuixRsjDUc2bwlhqQGD3qFRk',
    callbackURL: 'http://buzzfeedjihokoo.herokuapp.com/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done){
    console.log("we get inside the verify callback")
    User.findOne({'twitter.id_str': profile.id}, function(err, user){
      if(err){
        return done(err);
      }
      if(user){
        user.fullName = profile.displayName;
        user.userName = profile.username;
        user.twitter = profile._json;
        avatarUrl = profile._json.profile_image_url;
        token = token;
        tokenSecret = tokenSecret;
        user.save(function(err, user){
          return done(null, user);
        })
      } else{
        console.log('profile image url', profile._json.profile_image_url)
        var newUser = new User({
          fullName: profile.displayName,
          userName: profile.username,
          twitter: profile._json,
          avatarUrl: profile._json.profile_image_url,
          token: token,
          tokenSecret: tokenSecret
        });
        newUser.save();
        return done(null, newUser);
      }
    });
  }
));

var routes = require('./app/controllers/index.js');
var users = require('./app/controllers/users.js');

app.get('/', routes.index);

app.get('/auth/facebook', 
  passport.authenticate('facebook', { scope: 'email' }),
  users.signin);

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    users.authCallback(req, res);
  }
);

app.get('/logout', users.logout);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});