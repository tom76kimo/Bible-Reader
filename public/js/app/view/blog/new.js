define([
	'jquery',
	'underscore',
	'backbone',
	'markdown',
	'to-markdown',
	'bootstrap-markdown',
	'alertify.min',
	'model/article',
	'model/website',
	'view/mainMessage',
	'text!tpl/blog/new.html'
], function($, _, Backbone, Markdown, to_Markdown, BootstrapMarkdown, alertify, Article, website, MainMessageView, tpl){
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
							//new MainMessageView().success().render('新增文章成功。');
							alertify.success('新增文章成功。');
							website.navigate('blog/article/' + article.id, {trigger: true, replace: true});
						},
						error: function(data){
							//new MainMessageView().danger().render('嗚，似乎哪裡出現了問題。');
							alertify.error('嗚，似乎哪裡出現了問題。');
							//console.log(data);
						}
					});
				}
			});
		}
	});
});