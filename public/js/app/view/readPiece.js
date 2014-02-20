define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/readPiece.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		initialize: function(options){
			this.hasRead = options.hasRead;
			//console.log(this.hasRead);
		},
		render: function(){
			var self = this;
			var readChapterArray = this.getReadChapterArray();
			this.$el.html(this.template({book: JSON.stringify(this.model)}));
			for(var i=0; i<this.model.get('amount'); ++i){
				//var label = this.$('.btn-group').append('<label class="btn btn-primary"><input type="checkbox">' + (i+1) + '</label>');
				var label;
				if(readChapterArray.indexOf((i+1).toString()) > -1)
					label = $('<label class="btn btn-primary active"><input type="checkbox" checked="checked">' + (i+1) + '</label>').appendTo(this.$('.btn-group'));
				else
					label = $('<label class="btn btn-primary"><input type="checkbox">' + (i+1) + '</label>').appendTo(this.$('.btn-group'));
				label.data('number', (i+1));
				//console.log(jQuery.data(label, 'number'));
			}

			this.$('.panel').on('show.bs.collapse', function(){
				self.$('span').removeClass('glyphicon-chevron-right');
				self.$('span').addClass('glyphicon-chevron-down');
			});

			this.$('.panel').on('hide.bs.collapse', function(){
				self.$('span').removeClass('glyphicon-chevron-down');
				self.$('span').addClass('glyphicon-chevron-right');
			});
		},
		events: {
			'click label': 'choose'
		},
		choose: function(e){
			var number = $(e.target).data('number').toString();
			if($(e.target).children('input').is(':checked'))
				this.uncheck(number);
			else{
				this.check(number);
			}
		},
		check: function(number){
			var readChapter = this.hasRead.get('readChapter'),
			    readAmount = this.hasRead.get('amount');
			var readChapterArray = readChapter.split(',');
			readChapterArray.push(number);
			readChapterArray = _.compact(readChapterArray);
			readChapterArray = _.sortBy(readChapterArray, function(num){ return Math.sin(parseInt(num)); });
			readChapterArray = _.uniq(readChapterArray, true);
			console.log(readChapterArray);
			readChapter = readChapterArray.join(',');
			this.hasRead.set({readChapter: readChapter, amount: (readAmount+1)});
			this.hasRead.save({
				error: function(){
					//make the number unchecked.
				}
			});
		},
		uncheck: function(number){
			var readChapter = this.hasRead.get('readChapter'),
			    readAmount = this.hasRead.get('amount');
			var readChapterArray = readChapter.split(',');
			var index = readChapterArray.indexOf(number);
			if(index > -1)
				readChapterArray.splice(index, 1);
			readChapter = readChapterArray.join(',');
			console.log(readChapterArray);
			this.hasRead.set({readChapter: readChapter, amount: (readAmount-1)});
			this.hasRead.save({
				error: function(){
					//make the number unchecked.
				}
			});
		},
		getReadChapterArray: function(){
			var readChapterArray = this.hasRead.get('readChapter').split(',');
			return _.compact(readChapterArray);
		}
	});
});