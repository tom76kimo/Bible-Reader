define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/blog/articleEntry.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			var content = markdown.toHTML(this.model.get('content'));
			var nowTime = this.getNowTime(this.model.get('writeTime'));
			this.$el.html(this.template({data: JSON.stringify(this.model), writeTime: nowTime, content: content}));
		},

		getNowTime: function(timestamp){
			var timestamp = parseInt(timestamp);
			var today = new Date(timestamp),
				dd = today.getDate(),
				mm = today.getMonth()+1,
				yyyy = today.getFullYear();

			switch(mm){
				case 1: 
					mm = 'Jan';
					break;
				case 2: 
					mm = 'Feb';
					break;
				case 3: 
					mm = 'Mar';
					break;
				case 4: 
					mm = 'Apr';
					break;
				case 5: 
					mm = 'May';
					break;
				case 6: 
					mm = 'Jun';
					break;
				case 7: 
					mm = 'Jul';
					break;
				case 8: 
					mm = 'Aug';
					break;
				case 9: 
					mm = 'Sep';
					break;
				case 10: 
					mm = 'Oct';
					break;
				case 11: 
					mm = 'Nov';
					break;
				case 12: 
					mm = 'Dem';
					break;
				default: 
					//dd = 'Jan';
					break; 
			}

			if(dd === 1)
				dd += 'st';
			else if(dd === 2)
				dd += 'nd';
			else if(dd === 3)
				dd += 'rd';
			else
				dd += 'th';
			return mm + ', ' + dd + ', ' + yyyy;
		}
	});
});