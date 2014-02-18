define([
	'jquery',
	'underscore',
	'backbone',
	'view/login',
	'view/mainMessage'
], function($, _, Backbone, LoginView, MainMessage){
	return Backbone.Router.extend({
		initialize: function(){
			console.log('router');
		},
		routes: {
			'': 'welcome',
			'help': 'help',
			'fail': 'fail',
			'success': 'success'
		},
		welcome: function(){
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