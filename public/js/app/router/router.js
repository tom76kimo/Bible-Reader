define([
	'jquery',
	'underscore',
	'backbone',
	'view/login'
], function($, _, Backbone, LoginView){
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