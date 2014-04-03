define([
	'jquery',
	'underscore',
	'backbone',
	'markdown',
	'to-markdown',
	'bootstrap-markdown',
	'model/article',
	'model/website',
	'text!tpl/blog/new.html'
], function($, _, Backbone, Markdown, to_Markdown, BootstrapMarkdown, Article, website, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			var self = this;
			this.$el.html(this.template);
			this.$('textarea').markdown({
				savable: true,
				onSave: function(e){
					var title = self.$('input[name=title]').val(),
						nowTime = self.getNowTime(),
						user = website.getUser();

					new Article().save({title: title, content: e.getContent(), lastUpdate: nowTime, writeTime: nowTime, userId: user.id}, {
						success: function(){
							
						},
						error: function(data){
							console.log(data);
						}
					});
				}
			});
		},

		getNowTime: function(){
			var today = new Date(),
				dd = today.getDate(),
				mm = today.getMonth()+1,
				yyyy = today.getFullYear();

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
			return mm + ', ' + dd + ', ' + yyyy;
		}
	});
});