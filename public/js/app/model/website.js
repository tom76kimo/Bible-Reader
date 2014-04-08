define([
	'backbone',
	'collection/users',
	'collection/books',
	'model/profile'
], function(Backbone, Users, Books, Profile){
	var website = Backbone.Model.extend({
		profiles: [],
		setUser: function(user){
			this.user = user;
		},
		getUser: function(){
			if(this.user)
				return this.user;
			else
				return null;
		},
		clearUser: function(){
			this.user = null;
		},
		getMe: function(callback){
			var self = this;
			if(this.user)
				callback && callback(this.user);
			else{
				$.post('/logged', function(data){
					if(data.status === 1){
						var user = new User(data.user);
						self.setUser(user);
						callback && callback(user);
					}
					else
						callback && callback('error');
				});
			}
		},
		getBooks: function(callback){
			if(!this.books){
				var self = this;
				var books = new Books();
				books.fetch({
					success: function(){
						self.books = books;
						callback && callback(books);
					},
					error: function(){
						throw new Error("Fetch books failed");
						callback && callback();
					}
				});
			}
			else
				callback && callback(this.books);
		},
		getUsers: function(callback){
			
			var self = this;
			this.users = new Users();
			this.users.fetch({
				success: function(users){
					self.users = users;
					callback && callback(users);
				},
				error: function(){
					throw new Error("Fetch users failed");
					callback && callback();
				}
			});
		},

		getUserById: function(userId, callback){
			var model;
			this.users && (model = this.users.findWhere({_id: userId}));
			if(model)
				callback && callback(model);
			else{
				this.getUsers(function(users){
					var model = users.findWhere({_id: userId});
					callback && callback(model);
				});
			}
		},
		getProfile: function(userId){
			if(this.profiles.length === 0){

			}
			else if(_.find(this.profiles, function(profile){

			})){

			}

			function loadProfile(callback){
				var profile = new Profile({userId: userId});
				profile.fetch({
					success: function(model){
						callback && callback(model);
					},
					error: function(){
						callback && callback();
					}
				});
			}
		}
	});
	return new website();
});