define([
	'jquery',
	'underscore',
	'backbone',
	'model/profile',
	'model/website',
	'collection/groups',
	'text!tpl/profile.html'
], function($, _, Backbone, Profile, Website, Groups, tpl){
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
						new Groups().fetch({
							success: function(groups){
								var group = groups.findWhere({_id: profile.get('group')});
								var groupName = '無';
								if(group)
									groupName = group.get('name');
								self.$el.html(self.template({user: JSON.stringify(user), profile: JSON.stringify(profile), groupName: groupName}));
							}
						});
					});
					
				},
				error: function(){
					
				}
			});
			
			return this;
		}
	});
});