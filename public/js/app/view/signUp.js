define([
	'jquery',
	'underscore',
	'backbone',
	'alertify.min',
	'model/website',
	'view/mainMessage',
	'text!tpl/signUp.html'
], function($, _, Backbone, alertify, Website, MainMessageView, tpl){
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
				//this.mainMessage.warning().render('Input box shell not be blank');
				alertify.error('格子都必須填滿喔');
				return;				
			}

			if(password.length < 4){
				//this.mainMessage.warning().render('Password is too short.');
				alertify.error('嗯，密碼太短了，必須至少有四個字。');
				//this.$('#formUserid').parent('div').addClass('has-warning has-feedback');
				//this.$('#formUserid').siblings('span').show();
				return;	
			}
			
			if(password !== rePassowrd){
				//this.mainMessage.warning().render('password and re-password don\'t match');
				alertify.error('密碼前後不符。');
				return;
			}

			var self = this;
			$.post('/signUp', {username: userId, password: password}, function(data){
				if(data.status === 1){
					//self.mainMessage.success().render('Sigin Up sucess! Please login through upper bar. <span class="glyphicon glyphicon-arrow-up"></span>');
					alertify.success('註冊成功！ 請透過上面的登入區塊登入。');
					//Website.navigate('#setting', {trigger: true, replace: true});
				}
				else{
					//self.mainMessage.warning().render(data.message);
					alertify.error('註冊失敗： ' + data.message);
				}
			}, 'json');
		},
		changeInput: function(e){
			if($(e.target).attr('type') === 'password'){
				if($(e.target).val().length < 4){
					$(e.target).parent('div').addClass('has-warning has-feedback');
					$(e.target).siblings('span').show();
					$(e.target).siblings('.localMessage').html('Too short.');
				}
				else{
					$(e.target).parent('div').removeClass('has-warning has-feedback');
					$(e.target).siblings('span').hide();
					$(e.target).siblings('.localMessage').html('');
				}				
			}
		}
	});
});