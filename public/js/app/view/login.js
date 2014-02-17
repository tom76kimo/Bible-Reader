define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/login.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		el: $('#login'),
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
				return;
			}
			var self = this;
			$.post('/login', {username: userId, password: password}, function(data){
				if(data.status === 1){
					self.$('.navbar-form').html('Hello Tom</h3>');
				}
				else{
					console.log('login fail');
				}
			}, 'json');
		}
	});
});