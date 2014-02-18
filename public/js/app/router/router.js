define([
	'jquery',
	'underscore',
	'backbone',
	'view/main',
	'view/login'
], function($, _, Backbone, MainView, LoginView){
	return Backbone.Router.extend({
		initialize: function(){
			
		},
		routes: {
			'': 'welcome',
			'help': 'help',
			'fail': 'fail',
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
		}
	});
});