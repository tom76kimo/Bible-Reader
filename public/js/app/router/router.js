define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
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
			console.log('welcome');
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