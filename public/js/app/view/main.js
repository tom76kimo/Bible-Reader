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
			this.$('#updatesLog').on('show.bs.modal', function (e) {
				$(this).find('#logBody').html('<iframe src="https://docs.google.com/document/d/12oNIfYpWdFBL03toVqxpRJmqICosa1WSnCne5IGUZxs/pub?embedded=true" width="550" height="500"></iframe>');
			});
		}
	});
});