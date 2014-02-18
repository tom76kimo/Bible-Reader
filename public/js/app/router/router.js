define([
	'jquery',
	'underscore',
	'backbone',
	'view/main',
	'view/login',
	'view/signUp'
], function($, _, Backbone, MainView, LoginView, SignUpView){
	return Backbone.Router.extend({
		initialize: function(){
			new LoginView().render();
		},
		routes: {
			'': 'welcome',
			'help': 'help',
			'fail': 'fail',
			'signUp': 'signUp',
			'success': 'success'
		},
		welcome: function(){
			new MainView().render();
			//new LoginView().render();
		},
		help: function(){

		},
		fail: function(){
			console.log('fail');
		},
		success: function(){
			console.log('Good Job!');
		},
		signUp: function(){
			new SignUpView().render();
			//new LoginView().render();
		}
	});
});