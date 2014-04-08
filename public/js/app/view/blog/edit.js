define([
	'jquery',
	'underscore',
	'backbone',
	'markdown',
	'to-markdown',
	'bootstrap-markdown',
	'model/article',
	'model/website',
	'view/mainMessage',
	'text!tpl/blog/edit.html'
], function($, _, Backbone, Markdown, to_Markdown, BootstrapMarkdown, Article, website, MainMessageView, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		initialize: function(options){
			this.article = new Article({_id: options.articleId});
			this.message = new MainMessageView();
		},
		render: function(){
			var self = this;
			var articleFinisher = $.Deferred(),
			    userFinisher = $.Deferred();
			this.article.fetch({
				success: function(article){
					articleFinisher.resolve();
				}
			});

			website.getMe(function(me){
				self.me = me;
				userFinisher.resolve();
			});

			$.when(articleFinisher, userFinisher).done(function(){
				if(self.me.id !== self.article.get('userId')){
					self.message.danger().render('抱歉，您沒有編輯這篇文章的權限。');
					website.navigate('#blog/main', {trigger: true});
				}
				self.$el.html(self.template);
				self.$('textarea').markdown({
					savable: true,
					onSave: function(e){
						var title = self.$('input[name=title]').val(),
							nowTime = new Date().getTime(),
							user = website.getUser();

						self.article.save({title: title, content: e.getContent(), lastUpdate: nowTime, writeTime: nowTime, userId: user.id}, {
							success: function(article){
								self.message.success().render('文章編輯成功。');
								website.navigate('blog/article/' + article.id, {trigger: true, replace: true});
							},
							error: function(data){
								self.message.danger().render('嗚，似乎哪裡出現了問題。');
								console.log(data);
							}
						});
					}
				});
				self.$('input[name=title]').val(self.article.get('title'));
				self.$('textarea').val(self.article.get('content'));				
			});
			


		}
	});
});