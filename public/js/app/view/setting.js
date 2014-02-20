define([
	'jquery',
	'underscore',
	'backbone',
	'model/website',
	'collection/books',
	'collection/hasReads',
	'text!tpl/setting.html'
], function($, _, Backbone, Website, Books, HasReads, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			var self = this;
			var user = Website.getUser();
			var userFinished = $.Deferred();
			var hasReadsFinished = $.Deferred();
			var booksFinished = $.Deferred();
			user.fetch({
				success: function(model){
					userFinished.resolve();
					//self.$el.html(self.template({user: JSON.stringify(model)}));
				},
				error: function(){
					userFinished.reject();
				}
			});
			var hasReads = new HasReads();
			hasReads.fetch({
				success: function(){
					hasReadsFinished.resolve();
				},
				error: function(){
					hasReadsFinished.reject();
				}
			});
			var books = new Books();
			books.fetch({
				success: function(){
					booksFinished.resolve();
				},
				error: function(){
					booksFinished.reject();
				}
			});

			var badges = [];
			$.when(userFinished, hasReadsFinished, booksFinished).done(function(){
				var percentage = calculate();
				//console.log(badges);
				self.$el.html(self.template({user: JSON.stringify(user), percentage: percentage, badges: badges}));
				
			});
			
			function calculate(){
				var bibleTotalChapterAmount = 1189;
				var currentChapterAmount = 0;
				for(var i=0; i<hasReads.length; ++i){
					currentChapterAmount += hasReads.models[i].get('amount');
					if(hasReads.models[i].get('amount') === hasReads.models[i].get('totalAmount')){
						var bookId = hasReads.models[i].get('bookId');
						var book = books.findWhere({_id: bookId});
						badges.push(book.get('cname'));
					}
						
				}
				var percentage = Math.floor((currentChapterAmount/bibleTotalChapterAmount)*10000);
				return (percentage/100);
			}
		}
	});
});