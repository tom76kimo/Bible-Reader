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
			'click #fireSignin': 'signUp',
			'change input': 'changeInput'
		},
		signUp: function(){
			var userId = this.$('#formUserid').val(),
				password = this.$('#formPassword').val(),
				rePassowrd = this.$('#formRePassword').val();
			if(userId === '' || password === '' || rePassowrd === ''){
				this.mainMessage.warning().render('Input box shell not be blank');
				return;				
			}

			if(userId.length < 4 || password.length < 4){
				this.mainMessage.warning().render('User ID are too short.');
				//this.$('#formUserid').parent('div').addClass('has-warning has-feedback');
				//this.$('#formUserid').siblings('span').show();
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
		},
		changeInput: function(e){
			if($(e.target).val().length < 4){
				$(e.target).parent('div').addClass('has-warning has-feedback');
				$(e.target).siblings('span').show();
				$(e.target).siblings('.localMessage').html('Too short.');
			}
			else{
				$(e.target).parent('div').removeClass('has-warning has-feedback');
				$(e.target).siblings('span').hide();
			}

		}
	});
});