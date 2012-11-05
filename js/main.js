
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

var Attendees = Backbone.Collection.extend({
	model: app.AttendeeModel
});

app.AttendeeCollection = new Attendees([
	{ firstname: 'Guillaume', lastname: 'Grégoire' },
	{ firstname: 'Tim', lastname: 'Stubbs' }
]);

//
// Views
//

app.ItemView = Backbone.View.extend({
	tagName: 'li',

	template: _.template('<span class="name <%= present ? "present" : "absent" %>"><%= firstname %> <%= lastname %></span> <span class="delete">[x]</span>'),

	events: {
		'dblclick .name': 'editItem',
		'click .delete': 'destroyItem',
		'click .name': 'toggleItem'
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

//
// Init views
//

$(function () {
	new app.ListView;
	new app.InputView;
});


