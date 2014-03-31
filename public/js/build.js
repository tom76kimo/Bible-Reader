({
	baseUrl: './lib',
	paths: {
	  model: '../app/model',
	  view: '../app/view',
	  router: '../app/router',
	  collection: '../app/collection',
	  lan: '../app/model/lan',
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
	},
	optimizeCss: "standard",
    name: "../app",
    out: "app-built.js"
})