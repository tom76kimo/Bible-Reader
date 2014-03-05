define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/settingAddr.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		initialize: function(options){
			this.user = options.user;
			this.profile = options.profile;
			this.groups = options.groups;
		},
		render: function(){
			var groupName;
			for(var i=0; i<this.groups.length; ++i){
				if(this.profile.get('group') === this.groups.models[i].get('_id'))
					groupName = this.groups.models[i].get('name');
			}
			this.$el.html(this.template({user: JSON.stringify(this.user), profile: JSON.stringify(this.profile), groupName: groupName}));
			return this;
		}
	});
});