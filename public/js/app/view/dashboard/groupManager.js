define([
	'jquery',
	'underscore',
	'backbone',
	'model/group',
	'view/mainMessage',
	'text!tpl/dashboard/groupManager.html'
], function($, _, Backbone, Group, MainMessageView, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		render: function(){
			this.$el.html(this.template());
			return this;
		},
		events: {
			'click #addGroup': 'addGroup'
		},
		addGroup: function(){
			var name = this.$('#groupName').val(),
			    net = this.$('#groupNet').val(),
			    pastor = this.$('#groupPastor').val();
			//console.log(name+net+pastor);
			var group = new Group();
			group.save({name: name, amount: 0, net: net, pastor: pastor}, {
				success: function(model){
					new MainMessageView().success().render('Insert successfully');
				},
				error: function(){
					new MainMessageView().danger().render('Insert failed');
				}
			});
		}
	});
});