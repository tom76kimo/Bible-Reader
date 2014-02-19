define([
	'jquery',
	'underscore',
	'backbone',
	'view/main',
	'view/login',
	'view/signUp',
	'view/setting',
	'view/read',
	'model/website'
], function($, _, Backbone, MainView, LoginView, SignUpView, SettingView, ReadView, Website){
	return Backbone.Router.extend({
		initialize: function(){
			new LoginView();
		},
		routes: {
			'': 'welcome',
			'help': 'help',
			'fail': 'fail',
			'signUp': 'signUp',
			'success': 'success',
			'setting': 'setting',
			'read': 'read'
		},
		welcome: function(){
			new MainView().render();
			//new LoginView().render();
		},
		setting: function(){
			if(!Website.getUser())
				this.navigate('/', {trigger: true, replace: true});
			else
				new SettingView().render();
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
		},
		read: function(){
			new ReadView().render();
		}
	});
});