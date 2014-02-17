var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done){
		if('Tom' === username && '123456' === password){
			console.log(username + ', ' + password);
			return done(null, {name: 'Tom'});
		}
		else
			return done(null, false, '{}');
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
	      return res.redirect('/fail')
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/#success');
	    });
	  })(req, res, next);
});

app.get('/fail', function(req, res){
	console.log('fail');
	res.send({message: 'fail'});
});

app.post('/users', function(req, res){
	console.log('create');
	res.send(200, {id: 45});
});

app.get('/users/:userId', loadUser, function(req, res){
	console.log('get too');
	res.send({name: name});
});

app.put('/users/:userId', loadUser, function(req, res){
	console.log('PUT: '+req.body.name);
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