define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/blog-readBible.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			this.$el.html(this.template);
		}
	});
});