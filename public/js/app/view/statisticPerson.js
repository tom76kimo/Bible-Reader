define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/statisticPerson.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		initialize: function(options){
			this.books = options.books;
		},
		render: function(){
			var staData = this.model,
			    self = this;
			this.$el.html('<td><img src="/assets/images/loading.gif" width="30"/></td>');
			
			/*
			$.post('/progress', {userId: user.get('_id')}, function(data){
				var percentage = calPercentage(data.totalReadChapter);
				var badges = getBadgesName(data.badges);
				self.$el.html(self.template({percentage: percentage, username: user.get('username'), userId: user.get('_id'), badges: badges}));
			}, 'json');*/
			var percentage = calPercentage(staData.totalReadChapter);
			var badges = getBadgesName(staData.badges);
			var thumbnailURL = (this.model.FBID === null)? 'assets/images/man.png': 'http://graph.facebook.com/' + this.model.FBID + '/picture?width=100&height=100';
			self.$el.html(self.template({percentage: percentage, username: staData.username, userId: staData._id, badges: badges, thumbnailURL: thumbnailURL}));

			function calPercentage(value){
				var percentage = Math.floor((value / 1189) * 10000);
				return (percentage / 100);
			}

			function getBookName(bookId){
				for(var i=0; i<self.books.length; ++i){
					if(self.books.models[i].id === bookId)
						return self.books.models[i].get('cname');
				}
			}

			function getBadgesName(badges){
				var badgesName = [];
				if(!badges)
					return badgesName;
				for(var i=0; i<badges.length; ++i){
					badgesName.push(getBookName(badges[i]));
				}
				return badgesName;
			}
		}
	});
});