define([
	'backbone',
	'collection/books'
], function(Backbone, Books){
	var website = Backbone.Model.extend({
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
		}
	});
	return new website();
});