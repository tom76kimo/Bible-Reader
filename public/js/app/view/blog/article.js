define([
	'jquery',
	'underscore',
	'backbone',
	'model/article',
	'model/website',
	'text!tpl/blog/article.html'
], function($, _, Backbone, Article, website, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		initialize: function(options){
			this.article = new Article({_id: options.articleId});
		},
		render: function(){
			var self = this;
			var windowHeight = $(window).height();
			this.article.fetch({
				success: function(article){
					var content = markdown.toHTML(article.get('content'));
					var writeTime = self.toDate(article.get('writeTime'));
					var lastUpdate = self.toDate(article.get('lastUpdate'));
					self.$el.html(self.template({data: JSON.stringify(article), content: content, writeTime: writeTime, lastUpdate: lastUpdate}));
					this.$('.articleMain').height(windowHeight-50);
					var me;
					website.getMe(function(model){
						me = model;
						if(article.get('userId') === me.id){
							this.$('#editArticle').show(0);
						}
					});
					if(article.get('writeTime') !== article.get('lastUpdate'))
						self.$('.lastUpdate').show(300);
				}
			});
			
		},

		toDate: function(timestamp){
			var timestamp = parseInt(timestamp);
			var today = new Date(timestamp),
				dd = today.getDate(),
				mm = today.getMonth()+1,
				yyyy = today.getFullYear(),
				hh = today.getHours(),
				mmm = today.getMinutes(),
				ss = today.getSeconds();

			switch(mm){
				case 1: 
					mm = 'Jan';
					break;
				case 2: 
					mm = 'Feb';
					break;
				case 3: 
					mm = 'Mar';
					break;
				case 4: 
					mm = 'Apr';
					break;
				case 5: 
					mm = 'May';
					break;
				case 6: 
					mm = 'Jun';
					break;
				case 7: 
					mm = 'Jul';
					break;
				case 8: 
					mm = 'Aug';
					break;
				case 9: 
					mm = 'Sep';
					break;
				case 10: 
					mm = 'Oct';
					break;
				case 11: 
					mm = 'Nov';
					break;
				case 12: 
					mm = 'Dem';
					break;
				default: 
					//dd = 'Jan';
					break; 
			}

			if(dd === 1)
				dd += 'st';
			else if(dd === 2)
				dd += 'nd';
			else if(dd === 3)
				dd += 'rd';
			else
				dd += 'th';

			if(mmm < 10)
				mmm = '0' + mmm;

			if(ss < 10)
				ss = '0' + ss;
			return mm + ', ' + dd + ', ' + yyyy + ' ' + hh + ':' + mmm + ':' + ss;
		}
	});
});