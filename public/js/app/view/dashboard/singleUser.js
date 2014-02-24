define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/dashboard/singleUser.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			this.$el.html(this.template({user: JSON.stringify(this.model)}));
		}
	});
});