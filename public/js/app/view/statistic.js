define([
	'jquery',
	'underscore',
	'backbone',
	'view/readPiece',
	'view/statisticPerson',
	'model/hasRead',
	'model/website',
	'model/statistic',
	'collection/hasReads',
	'collection/books',
	'text!tpl/statistic.html'
], function($, _, Backbone, ReadPieceView, StatisticPersonView, HasRead, Website, Statistic, HasReads, Books, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			var self = this;
			//var this.users;
			//var usersFinisher = $.Deferred(),
			var booksFinisher = $.Deferred(),
			    staDataFinisher = $.Deferred();
			//this.statistic = new Statistic();
			//this.statistic.calculate(function(users){
			//	self.users = users;
			//	usersFinisher.resolve();
			//});

			/*
			Website.getUsers(function(users){
				self.users = users;
				usersFinisher.resolve();
			});*/

			$.get('/statisticData', {}, function(data){
				self.staData = _.sortBy(data, function(obj){
					return obj.totalReadChapter * -1;
				});
				staDataFinisher.resolve();
			}, 'json');

			Website.getBooks(function(books){
				self.books = books;
				booksFinisher.resolve();
			});

			$.when(booksFinisher, staDataFinisher).done(function(){
				var showReadingButton = 0;
				if(Website.getUser())
					showReadingButton = 1;
				self.$el.html(self.template({showReadingButton: showReadingButton}));
				/*
				for(var i=0; i<self.users.length; ++i){
					var tr = $('<tr>').appendTo('#panel');
					new StatisticPersonView({el: tr, model: self.users.models[i], books: self.books}).render();
				}*/
				setTimeout(function(){
					for(var i=0; i<self.staData.length; ++i){
						var tr = $('<tr>').appendTo('#panel');
						new StatisticPersonView({el: tr, model: self.staData[i], books: self.books}).render();
					}
					self.$('.panel-group').addClass('animated fadeInDown');
				}, 0);
			});	
		}
	});
});