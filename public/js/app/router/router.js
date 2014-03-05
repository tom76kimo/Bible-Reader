define([
	'jquery',
	'underscore',
	'backbone',
	'model/user',
	'model/statistic',
	'view/main',
	'view/login',
	'view/signUp',
	'view/setting',
	'view/read',
	'view/statistic',
	'view/blog-readBible',
	'view/dashboard',
	'model/website'
], function($, _, Backbone, User, Statistic, MainView, LoginView, SignUpView, SettingView, ReadView, StatisticView, BlogView, DashBoardView, Website){
	return Backbone.Router.extend({
		initialize: function(){
			new LoginView();
			Website.navigate = this.navigate;
		},
		checkAuth: function(exec){
			var self = this;
			/*
			if(!Website.getUser())
				this.navigate('/', {trigger: true, replace: true});
			else
				exec && exec();*/

			$.post('/logged', function(data){
				if(data.status === 1){
					if(!Website.getUser()){
						var user = new User({_id: data.id});
						user.fetch({
							success: function(model, res, options){
								Website.setUser(model);
								exec && exec();
							},
							error: function(){
								self.navigate('/', {trigger: true, replace: true});
							}
						});
					}
					else
						exec && exec();
				}
				else
					self.navigate('/', {trigger: true, replace: true});
			});
		},
		routes: {
			'': 'welcome',
			'help': 'help',
			'fail': 'fail',
			'signUp': 'signUp',
			'success': 'success',
			'setting': 'setting',
			'read': 'read',
			'statics': 'statics',
			'blog-readBible': 'blog',
			'dashboard': 'dashboard'
		},
		welcome: function(){
			new MainView().render();
			//new LoginView().render();
		},
		setting: function(){
			this.checkAuth(function(){
				new SettingView().render();
			});
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
			this.checkAuth(function(){
				new ReadView().render();
			});
		},
		statics: function(){
			new StatisticView().render();
		},
		blog: function(){
			new BlogView().render();
		},
		dashboard: function(){
			new DashBoardView().render();
		}
	});
});