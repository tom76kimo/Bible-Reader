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
						nowTime = new Date().getTime(),
						user = website.getUser();

					new Article().save({title: title, content: e.getContent(), lastUpdate: nowTime, writeTime: nowTime, userId: user.id}, {
						success: function(article){
							website.navigate('blog/article/' + article.id, {trigger: true, replace: true});
						},
						error: function(data){
							console.log(data);
						}
					});
				}
			});
		}
	});
});