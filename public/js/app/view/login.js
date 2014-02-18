define([
	'jquery',
	'underscore',
	'backbone',
	'view/mainMessage',
	'text!tpl/login.html'
], function($, _, Backbone, MainMessage, tpl){
	return Backbone.View.extend({
		el: $('#login'),
		initialize: function(){
			this.mainMessage = new MainMessage();
		},
		render: function(){
			this.$el.html(_.template(tpl, {}));
		},
		events: {
			'click #loginBtn': 'login'
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
				if(data.status === 1){
					self.mainMessage.success().render('登入成功!!!');
				}
				else{
					self.mainMessage.danger().render('<strong>注意!</strong>登入失敗，請檢查帳號密碼是否正確。');
				}
			}, 'json');
		}
	});
});