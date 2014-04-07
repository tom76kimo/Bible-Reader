define([
	'jquery',
	'underscore',
	'backbone',
	'collection/articles',
	'view/blog/articleEntry',
	'text!tpl/blog/main.html'
], function($, _, Backbone, Articles, ArticleEntry, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		articles: new Articles(),
		render: function(){
			var self = this;
			this.articles.fetch({
				success: function(res){
					self.$el.html(self.template);
					for(var i=0; i<self.articles.length; ++i){
						var div = $('<div class="blog-post"></div>').appendTo('.blog-main');
						new ArticleEntry({el: div, model: self.articles.models[i]}).render();
					}
				}
			});
			
		}
	});
});