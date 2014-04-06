$(function(){

	Backbone.sync = function(method, model, success, error){
    	success();
  	}

	var Row = Backbone.Model.extend({
		defaults: {
			firstName: 'Devin',
			lastName: 'Stallings'
		}
	});

	var Grid = Backbone.Collection.extend({
		model: Row
	});

	//Responsible for rendering each row
	var RowView = Backbone.View.extend({
		tagName: 'tr',

		events: {
			'click span.delete': 'remove'
		},
		initialize: function(){
			_.bindAll(this, 'render', 'remove', 'unrender');
			this.model.bind('remove', this.unrender);
		},
		render: function(){
			$(this.el).html('<td>'+this.model.get('firstName')+' '+this.model.get('lastName')+' &nbsp; &nbsp; <span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span></td>');
			return this;
		},
		unrender: function(){
			$(this.el).remove();
		},
		remove: function(){
			this.model.destroy();
		}
	});

	// Define the view for grid
	var GridView = Backbone.View.extend({
		el: $('#gridapp'),

		initialize: function(){
			_.bindAll(this, 'render', 'addRow', 'appendRow');

			this.collection = new Grid();
			this.collection.bind('add', this.appendRow);

			this.counter = 0;
			this.render();
		},

		events: {
			'click button#add': 'addRow'
		},

		render: function(){
			var self = this;

			$(this.el).append("<thead><tr><th><button id='add'>Add Row</button></th></tr></thead>");
			_(this.collection.models).each(function(row){
				self.appendRow(row);
			}, this);
		},

		addRow: function(){
			this.counter++;
			var row = new Row();
			row.set({
				lastName: row.get('lastName')+' '+this.counter
			});
			this.collection.add(row);
		},
		
		appendRow: function(row){
			var rowView = new RowView({
				model: row
			});

			$(this.el).append(rowView.render().el);
		}
	});

	var gridApp = new GridView();

}());