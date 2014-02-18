define([
	'jquery',
	'underscore',
	'backbone',
	'view/login',
	'view/mainMessage',
	'text!tpl/main.html'
], function($, _, Backbone, LoginView, MainMessageView, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		initialize: function(){},
		render: function(){
			this.$el.html(this.template({}));
		}
	});
});