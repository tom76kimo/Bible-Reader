define([
	'backbone'
], function(Backbone){
	var website = Backbone.Model.extend({
		setUser: function(user){
			this.user = user;
		},
		getUser: function(){
			if(this.user)
				return this.user;
			else
				return null;
		},
		clearUser: function(){
			this.user = null;
		}
	});
	return new website();
});