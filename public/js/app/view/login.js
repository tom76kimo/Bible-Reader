define([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'view/mainMessage',
	'text!tpl/login.html',
	'text!tpl/logged.html'
], function($, _, Backbone, bootstrap, MainMessage, tpl, loggedTpl){
	return Backbone.View.extend({
		el: $('#login'),
		initialize: function(){
			this.mainMessage = new MainMessage();
		},
		render: function(){
			var self = this;
			this.$el.html(_.template(tpl));
			this.$el.find('.navbar-form').keydown(function(event) {
				if(event.which === 13)
					self.login();
			});
		},
		loggedRender: function(nickname){
			this.$el.html(_.template(loggedTpl, {nickname: nickname}));
		},
		events: {
			'click #loginBtn': 'login',
			'click #logout': 'logout'
		},
		login: function(){
			var userId = this.$('#userId').val(),
			    password = this.$('#password').val();

			if(userId === '' || password === ''){
				this.mainMessage.warning().render('帳號密碼不可以空白。');
				return;
			}
			var self = this;
			$.post('/login', {username: userId, password: password}, function(data){
				if(data.status === 1)
					hasLogged(data);
				else{
					self.mainMessage.danger().render('<strong>注意!</strong>登入失敗，請檢查帳號密碼是否正確。');
				}
			}, 'json');

			function hasLogged(data){
				var nickname;
				if(data.user.nickname)
					nickname = data.user.nickname;
				else
					nickname = data.user.username;
				self.loggedRender(nickname);
				self.mainMessage.success().render('<strong>Hello!! ' + nickname + '</strong>，您已經登入成功!!!');
			}
		},

		logout: function(){
			var self = this;
			$.post('/logout', {}, function(){
				self.render();
				self.mainMessage.warning().render('您已經成功登出。');
			});
		}
	});
});