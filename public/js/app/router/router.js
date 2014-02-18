define([
	'jquery',
	'underscore',
	'backbone',
	'view/main',
	'view/login',
	'view/signin'
], function($, _, Backbone, MainView, LoginView, SigninView){
	return Backbone.Router.extend({
		initialize: function(){
			
		},
		routes: {
			'': 'welcome',
			'help': 'help',
			'fail': 'fail',
			'signin': 'signin',
			'success': 'success'
		},
		welcome: function(){
			new MainView().render();
			new LoginView().render();
		},
		help: function(){

		},
		fail: function(){
			console.log('fail');
		},
		success: function(){
			console.log('Good Job!');
		},
		signin: function(){
			new SigninView().render();
			new LoginView().render();
		}
	});
});