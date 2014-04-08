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
	Group = database.Group,
	Achievement = database.Achievement,
	Article = database.Article;
var crypto = require('crypto');
var Promise = require('es6-promise').Promise;
var _ = require('underscore');



//==== Utility
Array.prototype.isContain = function(resource){
	var result = true;
	for(var i=0; i<resource.length; ++i){
		var found = false;
		for(var j=0; j<this.length; ++j){
			if(resource[i].toString() === this[j].toString())
				found = true;
		}
		result &= found;
	}
	return !!result;
}


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

function checkAdmin(req, res, next){
	next();
}

app.post('/logged', function(req, res){
	if(req.user)
		res.send(200, {status: 1, user: req.user});
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

app.post('/article', function(req, res){
	var article = new Article(req.body);
	article.save(function(err, model){
		if(err){
			res.send(500);
			return;
		}
		if(model){
			res.send(200, model);
			return;
		}
		else{
			res.send(500);
			return;
		}

	});
});

app.put('/article/:id', function(req, res){
	var article = {
		title: req.body.title,
		content: req.body.content,
		lastUpdate: new Date().getTime()
	};
	Article.update({_id: req.params.id}, article, function(err, numberAffected, raw){
		if(err){
			res.send(500);
			return;
		}
		res.send(200, {_id: req.params.id});
	});
});

app.get('/article/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		if(err){
			res.send(500);
			return;
		}
		User.findById(article.userId, function(err, user){
			if(err){
				res.send(500);
				return;
			}
			var output = article.toObject();
			output.username = user.username;
			res.send(200, output);
		});
	});
});

var articlesPromises = [];
app.get('/articles', function(req, res){
	articlesPromises.length = 0;
	Article.find({}, function(err, articles){
		if(err){
			res.send(500);
			return;
		}
		for(var i=0; i<articles.length; ++i){
			(function(i){
				var promise = new Promise(function(resolve, reject){
					User.findById(articles[i].userId, function(err, user){
						if(err){
							reject();
							return;
						}

						if(user){
							var outputObj = articles[i].toObject();
							outputObj.username = user.username;
							resolve(outputObj);
						}
						else{
							reject();
						}
					});
				});
				articlesPromises.push(promise);
			})(i);
		}
		Promise.all(articlesPromises).then(function(result){
			res.send(200, result);
		});
	});
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

var statisticDataPromises = [];
app.get('/statisticData', function(req, res){
	statisticDataPromises = [];
	User.find({}, function(err, user){
		for(var i=0; i<user.length; ++i){
			(function(i){
				user[i].password = null
				var promise = new Promise(function(resolve, reject){
					calculates(user[i]._id, function(output){
						var outputObj = {username: user[i].username, _id: user[i]._id};
						outputObj = _.extend(outputObj, output);
						resolve(outputObj);
					});
				});
				statisticDataPromises.push(promise);
			})(i);
		}
		Promise.all(statisticDataPromises).then(function(result){
			res.send(result);
		});
    	
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

app.get('/achievements', function(req, res){
	Achievement.find({}, function(err, achievements){
		if(err) res.send(500);
		else res.send(200, achievements);
	});
});

app.get('/userAchievements', function(req, res){
	if(!req.user){
		res.send(500);
		return;
	}
	
	calculates(req.user.id, function(data){
		calAchievement(data, function(result){
			res.send(200, result);
		});
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




/*
calculates("531682ed21498354179a1d39", function(data){
	calAchievement(data.badges, function(result){
		console.log(result);
	});
}); */


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

function calAchievement(data, callback){
	var badgesOrders;
	var badges = data.badges;
	var achievementResult = [];
	Book.find({}, function(err, books){
		badgesOrders = getBadgesOrder();
		if(badgesOrders.length === 0){
			nonNumberAchive();
			callback && callback(achievementResult);
		}
		else{
			Achievement.find({}, function(err, achievements){
				
				for(var i=0; i<achievements.length; ++i){
					var condition = achievements[i].condition.toString().split(',') || [];
					if(badgesOrders.isContain(condition))
						achievementResult.push(achievements[i].name);
				}

				nonNumberAchive();
				callback && callback(achievementResult);
			});
		}
		
		
		function getBadgesOrder(){
			var badgesOrders = [];
			for(var i=0; i<badges.length; ++i){
				for(var j=0; j<books.length; ++j){
					if(badges[i] == books[j]._id)
						badgesOrders.push(books[j].order);
				}
			}
			return badgesOrders;
		}

		function nonNumberAchive(){
			isOneChapter(achievementResult);
			isTenChapter(achievementResult);
		}

		function isOneChapter(result){
			if(data.totalReadChapter >= 1)
				result.push('好的開始！');
		}

		function isTenChapter(result){
			if(badges.length >= 10)
				result.push('書卷獎');
		}
	});

}
//console.log(arrayInclude([1, 2, 4], [2, 3, 4]));

function arrayInclude(resource, target){
	var result = true;
	for(var i=0; i<resource.length; ++i){
		var found = false;
		for(var j=0; j<target.length; ++j){
			if(resource[i] === target[j])
				found = true;
		}
		result &= found;
	}
	return !!result;
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.listen(9797);

//https.createServer(options, app).listen(9798);