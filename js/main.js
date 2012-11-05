
var app = {};

//
// Model
//

app.AttendeeModel = Backbone.Model.extend({
	defaults: {
		firstname: '',
		lastname: '',
		present: false
	}
});

//
// Collection
//

app.AttendeeCollection = Backbone.Collection.extend({
	url: '',
	model: app.AttendeeModel,

	present: function () {
		return this.filter(function (attendee) { return attendee.get('present'); });
	}
});

app.AttendeeCollection = new app.AttendeeCollection([
	{ firstname: 'Guillaume', lastname: 'Grégoire' },
	{ firstname: 'Tim', lastname: 'Stubbs' },
	{ firstname: 'Nicolas', lastname: 'Faugout' }
]);

//
// Views
//

app.ItemView = Backbone.View.extend({
	tagName: 'li',

	template: _.template('<input class="toggle" type="checkbox" <%= present ? "checked" : "" %>> <span class="name"><%= firstname %> <%= lastname %></span> <button class="destroy"></button>'),

	events: {
		'dblclick .name': 'editItem',
		'click .destroy': 'destroyItem',
		'click .toggle': 'toggleItem'
	},

	initialize: function () {
		this.model.on('destroy', this.remove, this);
		this.model.on('change', this.render, this);
	},

	render: function () {
		return this.$el.html(this.template(this.model.toJSON()));
	},

	editItem: function () {
		var name = window.prompt('Edit attendee\'s name:', this.model.get('firstname') + ' ' + this.model.get('lastname'));
		if (name) {
			name = name.split(' ');
			this.model.set({ firstname: name[0], lastname: name[1] });
		}
	},

	destroyItem: function () {
		this.model.destroy();
	},

	toggleItem: function () {
		this.model.set('present', !this.model.get('present'));
	}
});

app.ListView = Backbone.View.extend({
	el: $('#attendee-list'),

	initialize: function () {
		app.AttendeeCollection.each(this.addItem, this);
		app.AttendeeCollection.on('add', this.addItem, this);
	},

	addItem: function (attendee) {
		this.$el.append(new app.ItemView({ model: attendee }).render());
	}
});

app.InputView = Backbone.View.extend({
	el: $('#new-attendee'),

	events: {
		'keypress': 'addAttendee'
	},

	initialize: function () {
		app.AttendeeCollection.on('add', this.clearInput, this);
	},

	addAttendee: function (e) {
		if (e.which == 13) {
			var text = this.$el.val().split(' ');
			app.AttendeeCollection.add({ firstname: text[0], lastname: text[1] });
		}
	},

	clearInput: function () {
		this.$el.val('');
	}
});

app.FooterView = Backbone.View.extend({
	el: $('#footer'),

	template: _.template('<span id="attendee-count"><strong><%= present %></strong> / <strong><%= total %></strong> participants présents</span>'),

	initialize: function () {
		app.AttendeeCollection.on('all', this.render, this);
		this.render();
	},

	render: function () {
		var present = app.AttendeeCollection.present().length;
		return this.$el.html(this.template({ present: present, total: app.AttendeeCollection.length }));
	}
});

//
// Init views
//

$(function () {
	new app.ListView;
	new app.InputView;
	new app.FooterView;
});


