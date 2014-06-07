var User = require('../models/users.js')['User'];

exports.login = function(req, res){
  res.render('login');
};

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.signin = function(req, res){
  // console.log('SIGN IN REDIRECT?');
  // res.set('content-type', 'text/javascript');
  res.render('index');
  // res.redirect('/');
};

exports.authCallback = function(req, res){
	res.redirect('/');
};