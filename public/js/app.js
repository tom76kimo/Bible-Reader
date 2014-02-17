requirejs.config({
    baseUrl: 'js/lib',
	paths: {
	  //app: 'js/app'
	  model: '../app/model',
	  view: '../app/view',
	  router: '../app/router',
	  tpl: '../tpl'
	},
	shim: {
	  'jquery': {
	    exports: '$'
	  },
	  'underscore': {
	    exports: '_'
	  },
	  'bootstrap': {
	  	deps: ['jquery'],
	  	exports: 'bootstrap'
	  },
	  'backbone': {
	  	deps: ['jquery', 'underscore'],
	  	exports: 'Backbone'
	  }
	}
});

define(['jquery', 'underscore', 'backbone', 'bootstrap', 'router/router'], function($, _, Backbone, bootstrap, Router){
	
	new Router();
	Backbone.history.start();
	/*
	var Person = Backbone.Model.extend({
		defaults: {
			name: 'no name'
		},
		urlRoot: '/users'
	});

	var mainRole = new Person();
	//mainRole.set({name: 'David'});
	mainRole.save();
	mainRole.save({}, {
		success: function(model, res, options){
			console.log(model);
			model.save({name: 'David'}, {
				success: function(model, res, options){
					console.log(model.get('name'));
				}
			});
		},
		error: function(model, res, options){
			console.log('put fail');
		}
	});
	*/
	//console.log(mainRole.get('name'));
});

