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
			this.listenTo(this.hasRead, 'change', this.hasFinished);
		},
		render: function(){
			var self = this;
			//var readChapterArray = this.getReadChapterArray();
			this.$el.html(this.template({book: JSON.stringify(this.model)}));
			this.populateBtnGroup();
			this.hasFinished();

			this.$('#readAll').tooltip({container: 'body'});

			this.$('.panel').off();
			this.$('.panel').on('show.bs.collapse', function(){
				self.$('span').removeClass('glyphicon-chevron-right');
				self.$('span').addClass('glyphicon-chevron-down');
			});

			this.$('.panel').on('hide.bs.collapse', function(){
				self.$('span').removeClass('glyphicon-chevron-down');
				self.$('span').addClass('glyphicon-chevron-right');
			});
		},

		populateBtnGroup: function(){
			var self = this;
			var readChapterArray = this.getReadChapterArray();
			this.$('.btn-group').empty();
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
		},

		hasFinished: function () {
			if (parseInt(this.hasRead.get('amount'), 10) === parseInt(this.hasRead.get('totalAmount'), 10)) {
				this.$('.hasFinished').css('display', 'inline-block');
			} else {
				this.$('.hasFinished').css('display', 'none');
			}
		},

		events: {
			'click label': 'choose',
			'click #readAll': 'readAll'
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
			readChapterArray = _.sortBy(readChapterArray, function(num){ return parseInt(num); });
			readChapterArray = _.uniq(readChapterArray, true);
			readChapter = readChapterArray.join(',');
			//this.hasRead.set({readChapter: readChapter, amount: (readAmount+1)});
			this.hasRead.save({readChapter: readChapter, amount: (readAmount+1)}, {
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
			//console.log(readChapterArray);
			this.hasRead.set({readChapter: readChapter, amount: (readAmount-1)});
			this.hasRead.save({
				error: function(){
					//make the number unchecked.
					console.log('fail');
				}
			});
		},
		getReadChapterArray: function(){
			var readChapterArray = this.hasRead.get('readChapter').split(',');
			return _.compact(readChapterArray);
		},

		readAll: function(){
			var chapterAmount = this.model.get('amount'),
			    rangeArray = _.range(1, chapterAmount+1),
			    hasReadString = rangeArray.join(','),
			    self = this;
			this.hasRead.save({readChapter: hasReadString, amount: chapterAmount}, {
				success: function(){
					self.populateBtnGroup();
				},
				error: function(){
					//make the number unchecked.
					console.log('not ok');
				}
			});
		}
	});
});