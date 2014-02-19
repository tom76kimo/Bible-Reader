define([
	'jquery',
	'underscore',
	'backbone',
	'model/website',
	'text!tpl/setting.html'
], function($, _, Backbone, Website, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			var self = this;
			var user = Website.getUser();
			user.fetch({
				success: function(model){
					self.$el.html(self.template({user: JSON.stringify(model)}));
				}
			});
		}
	});
});