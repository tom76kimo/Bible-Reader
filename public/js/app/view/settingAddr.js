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
			this.$el.html(this.template({user: JSON.stringify(this.user), profile: JSON.stringify(this.profile)}));
			return this;
		}
	});
});