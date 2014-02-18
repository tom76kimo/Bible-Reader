var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bible');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({username: 'string', password: 'string'});
var User = mongoose.model('Users', userSchema);
//var Tom = new User({username: 'Tomm', password: '456'});


function validPassword(user, password){
	if(user.password !== password)
		return false;
	return true;
}

passport.use(new LocalStrategy(
	function(username, password, done){
		User.findOne({username: username}, function(err, user){
			if(err){ return done(err); }
			if(!user){
				console.log('no user');
				return done(null, false, { message: 'Incorrect username' });
			}
			if(!validPassword(password)){
				console.log('no pass');
				return done(null, false, { message: 'Incorrect password'});
			}
			return done(null, user);
		});
		/*
		if('Tom' === username && '123456' === password){
			return done(null, {name: 'Tom'});
		}
		else
			return done(null, false, '{}');*/
	}
));

var oneDay = 86400000;
app.configure(function(){
	app.use(express.compress());
	app.use('/', express.static(__dirname + '/public', { maxAge: oneDay }));
	app.use('/', express.directory(__dirname + '/public', { maxAge: oneDay }));
	app.use(express.cookieParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.session({secret: 'Super Tom'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});




passport.serializeUser(function(user, done) {
	console.log(user);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log('deSerial?');
    done(null, user);
});


function loadUser(req, res, next){
	if(req.params.userId){
		console.log('user id is: ' + req.params.userId);
		next();
	}
	else
		next();
}

var name = 'Tom';
function checkAdmin(req, res, next){
	next();
}

app.post('/login', function(req, res, next){

	passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.session.messages =  [info.message];
	      return res.json({status: 0})
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.json({status: 1, user: user});
	    });
	  })(req, res, next);
});

app.post('/signin', function(req, res, next){
	var username = req.body.username,
		password = req.body.password;

	User.findOne({username: username}, function(err, user){
		if(!user){
			var thisPerson = new User({username: username, password: password});
			thisPerson.save(function(err){
				res.send({status: 1, u: username});
			});
		}
		else{
			res.send({status: 0, message: 'user has existed'});
		}
	});
});

app.get('/fail', function(req, res){
	res.send({message: 'fail'});
});

app.post('/users', function(req, res){
	res.send(200, {id: 45});
});

app.get('/users/:userId', loadUser, function(req, res){
	res.send({name: name});
});

app.put('/users/:userId', loadUser, function(req, res){
	name = req.body.name;
	res.send(200, {name: name});
});

app.get('/users/:userId/admin', [loadUser, checkAdmin], function(req, res){
	res.send('hello world');
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.send({ user: req.user });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(3000);