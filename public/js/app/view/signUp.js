define([
	'jquery',
	'underscore',
	'backbone',
	'model/website',
	'view/mainMessage',
	'text!tpl/signUp.html'
], function($, _, Backbone, Website, MainMessageView, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		mainMessage: new MainMessageView(),
		render: function(){
			this.$el.html(this.template({}));
		},
		events: {
			'click #fireSignin': 'signUp'
		},
		signUp: function(){
			var userId = this.$('#formUserid').val(),
				password = this.$('#formPassword').val(),
				rePassowrd = this.$('#formRePassword').val();
			if(userId === '' || password === '' || rePassowrd === ''){
				this.mainMessage.warning().render('Input box shell not be blank');
				return;				
			}


			if(password !== rePassowrd){
				this.mainMessage.warning().render('password and re-password don\'t match');
				return;
			}

			var self = this;
			$.post('/signUp', {username: userId, password: password}, function(data){
				if(data.status === 1){
					self.mainMessage.success().render('Sigin Up sucess! Please login through upper bar. <span class="glyphicon glyphicon-arrow-up"></span>');
					//Website.navigate('#setting', {trigger: true, replace: true});
				}
				else{
					self.mainMessage.warning().render(data.message);
				}
			}, 'json');
		}
	});
});