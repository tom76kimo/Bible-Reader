var express = require('express');
var https = require('https');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var database = require('./database'),
	User = database.User,
	Book = database.Book,
	HasRead = database.HasRead,
	Profile = database.Profile,
	Group = database.Group;
var crypto = require('crypto');

/*
var fs = require('fs');

var options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};
*/

//new HasRead({userId: '1', bookId: '1', readChapter: '1,2'}).save();
/*
HasRead.findOne({userId: '1', bookId: '1'}, function(err, hasRead){
	if(err) console.log('failed');
	if(!hasRead)
		console.log('document not found');
});*/

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

			var encodePassword = crypto.createHash('md5').update(password).digest('hex');
			if(!validPassword(encodePassword)){
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
	app.disable('etag');
	app.use(express.cookieParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.session({secret: 'Super Tom'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});



passport.serializeUser(function(user, done) {
	//console.log(user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	//console.log('deSerial?');
	User.findById(id, function(err, user){
		done(err, user);
	});
    //done(null, user);
});


function loadUser(req, res, next){
	if(req.params.userId){
		//console.log('user id is: ' + req.params.userId);
		next();
	}
	else
		next();
}

var name = 'Tom';
function checkAdmin(req, res, next){
	next();
}

app.post('/logged', function(req, res){
	if(req.user)
		res.send(200, {status: 1, id: req.user._id});
	else
		res.send(200, {status: 0});
});

app.get('/hasreads', function(req, res){
	HasRead.find({userId: req.user._id}, function(err, hasRead){
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		res.setHeader('cache-control', 'private, max-age=0, no-cache');
		//console.log(hasRead);
		res.send(200, hasRead);
	});
	
});

app.all('*', function(req, res, next){
	res.removeHeader('x-power-by');
	next();
});

app.post('/group', function(req, res){
	var group = new Group(req.body);
	group.save(function(err, model){
		if(err) res.send(500);
		else res.send(200, model);
	});
});

app.post('/hasread', function(req, res){
	var hasRead = new HasRead(req.body);
	hasRead.save(function(err, model){
		res.send(200, model);
	});
});

app.put('/hasread', function(req, res){
	var data = {
		userId: req.body.userId, 
		bookId: req.body.bookId, 
		readChapter: req.body.readChapter,
		amount: req.body.amount,
		totalAmount: req.body.totalAmount
	};
	HasRead.update({_id: req.body._id}, data, function(err, numberAffected, raw){
		if(err)
			console.log(err);
		res.send(200);
	});
	//res.send(200);
});

app.post('/getProfile', function(req, res){
	var userId = req.body.userId;
	Profile.findOne({userId: userId}, function(err, profile){
		if(err)res.send(404);
		if(!profile)res.send(404);
		if(profile === null) res.send(404);
		else
		    res.send(200, {id: profile._id});
	});
});

app.get('/profile/:id', function(req, res){
	Profile.findOne({userId: req.params.id}, function(err, profile){
		if(err) res.send(404);
		if(!profile) res.send(404);
		if(profile === null) res.send(404);
		else
		    res.send(200, profile);
	});
});

app.put('/profile/:id', function(req, res){
	var data = {
		nickname: req.body.nickname,
		email: req.body.email,
		description: req.body.description,
		group: req.body.group
	};
	//console.log(req.params.id);
	Profile.update({userId: req.params.id}, data, function(err, numberAffected, raw){
		if(err){
			res.send(500);
		}
		res.send(200, {});
	});
});

app.get('/settingProfile/:id', function(req, res){
	var userId = req.params.id;
	var sendData = {};
	Profile.findOne({userId: req.params.id}, function(err, profile){
		if(err) res.send(404);
		if(!profile) res.send(404);
		if(profile === null) res.send(404);
		else{
			if(!req.user)
				res.send(404);

			sendData.description = profile.description || '';
			sendData.email = profile.email || '';
			sendData.group = profile.group || '';
			sendData.nickname = profile.nickname || '';
			sendData.userId = profile.userId || '';
			sendData.username = req.user.username;

			Group.find({}, function(err, groups){
				if(err) res.send(404);
				if(!groups) res.send(404);
				for(var i=0; i<groups.length; ++i){
					if(groups[i]._id == sendData.group){
						sendData.group = groups[i].name;
					}
						console.log(groups[i]._id + ', ' + sendData.group);
				}
				res.send(200, sendData);
			});
		} 
	});
});

app.post('/login', function(req, res, next){

	passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.session.messages =  [info.message];
	      return res.json({status: 0})
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.json({status: 1, id: user._id});
	    });
	  })(req, res, next);
});

app.post('/signUp', function(req, res, next){
	var username = req.body.username,
		password = req.body.password;

	User.findOne({username: username}, function(err, user){
		if(!user){
			var encodePassword = crypto.createHash('md5').update(password).digest('hex');
			var thisPerson = new User({username: username, password: encodePassword});
			thisPerson.save(function(err, user){
				var profile = new Profile({userId: user._id, nickname: '', email: '', description: ''});
				profile.save(function(err, user){
					res.send({status: 1, userId: user._id});
				});
				
				//console.log('save once');
			});
		}
		else{
			res.send({status: 0, message: 'user has existed'});
		}
	});
});

app.get('/books', function(req, res){
	Book.find({}, function(err, book){
    	res.send(book);
	});
	
});

app.get('/groups', function(req, res){
	Group.find({}, function(err, groups){
    	res.send(groups);
	});
	
});

app.post('/logout', function(req, res){
  req.logOut();
  res.redirect("/");
});

app.get('/fail', function(req, res){
	res.send({message: 'fail'});
});

app.post('/users', function(req, res){
	res.send(200, {id: 45});
});

app.get('/users/:userId', loadUser, function(req, res){
	res.send(req.user);
});

app.put('/users/:userId', loadUser, function(req, res){
	name = req.body.name;
	res.send(200, {name: name});
});

app.get('/users/:userId/admin', [loadUser, checkAdmin], function(req, res){
	res.send('hello world');
});

app.get('/statistic', function(req, res){
	User.find({}, function(err, user){
    	res.send(user);
	});
});

app.get('/allUser', function(req, res){
	User.find({}, function(err, user){
		for(var i=0; i<user.length; ++i){
			user[i].password = null
		}
    	res.send(user);
	});
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.send({ user: req.user });
});

app.post('/progress', function(req, res){
	calculates(req.body.userId, function(output){
		res.send(200, output);
	});
});





//calculates("5303252b0f9bcd282765f4ba", function(data){
//	console.log(data);
//});
function calculates(userId, callback){
	//console.log(userId);
	var output = {};
	output.badges = [];
	output.totalReadChapter = 0;
	HasRead.find({userId: userId}, function(err, hasReads){
		for(var i=0; i<hasReads.length; ++i){
			output.totalReadChapter += hasReads[i].amount;
			if(hasReads[i].amount === hasReads[i].totalAmount)
				output.badges.push(hasReads[i].bookId);
		}
		callback && callback(output);
	});
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(9797);

//https.createServer(options, app).listen(9798);