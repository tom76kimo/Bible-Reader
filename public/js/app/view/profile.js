define([
	'jquery',
	'underscore',
	'backbone',
	'model/profile',
	'model/website',
	'text!tpl/profile.html'
], function($, _, Backbone, Profile, Website, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		el: $('#main'),
		initialize: function(options){
			this.userId = options.userId;
		},
		render: function(){
			var self = this;
			var profile = new Profile({userId: this.userId});
			profile.fetch({
				success: function(model){
					Website.getUserById(self.userId, function(user){
						self.$el.html(self.template({user: JSON.stringify(user), profile: JSON.stringify(profile)}));
					});
					
				},
				error: function(){
					
				}
			});
			
			return this;
		}
	});
});