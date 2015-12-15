var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('nextstop', ['roles', 'weekItems']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


// ROUTES

app.get('/', function (req, res) {
	console.log("The server says hello")
});

// Gets role/goal data from DB
app.get('/roles', function (req, res) {
	console.log("Received roles list");

	// Pull data from mongo
	db.roles.find({type: "role", user: "krisheinrich"}, function (err, docs) {
		console.log(docs);
		res.json(docs);  // send array of DB docs as GET response
	});
});

// Gets sharpen the saw data from DB
app.get('/sharpeners', function (req, res) {
	console.log("Received sharpeners list");

	db.roles.find({type: "sharpener", user: "krisheinrich"}, function (err, docs) {
		console.log(docs);
		res.json(docs);  // send array of DB docs as GET response
	});
});

// Gets the weekly priorities data from DB
app.get('/weekItems', function (req, res) {
	console.log("Received week list");

	// Pull data from mongo
	db.weekItems.find({user: "krisheinrich"}, function (err, docs) {
		console.log(docs);
		res.json(docs);  // send array of DB docs as GET response
	});
});


// Delete single item (role/sharpener) by its ID
app.delete('/roles/:id', function (req, res) {
	var id = req.params.id;
	console.log(id + " deleted.");
	db.roles.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

// Add new role/sharpener to DB
app.post('/roles', function (req, res) {
	console.log(req.body);
	db.roles.insert(req.body, function (err, doc) {
		res.json(doc);
	});
});

// For addTaskTo function
app.put('/roles/:id', function (req, res) {
	var id = req.params.id;
	var task = req.body.name;
	console.log('!!' + task);
	
	db.roles.update({_id: mongojs.ObjectId(id)},
		{$push: {tasks: task}}
	);
	res.send('pushed to list');
	res.end();
});

// For deleteTask function
app.put('/roles/del/:id', function (req, res) {
	var id = req.params.id;
	var task = req.body.name;
	//var task = (req.params.task).toString();
	console.log(id, task);
	db.roles.update({_id: mongojs.ObjectId(id)},
		{$pull: {tasks: task}}
	);
	console.log('deleted ' + task + ' from list');
	res.end();
});

// Save week items
app.post('/weekItems', function (req, res) {
	console.log(req.body);   // req.body: {sunday: [], monday: [], ...}
	var week = req.body;
	console.log(week);
	var docs = [];
	for (day in week) {
		var doc = {};
		doc.user = "krisheinrich";     // CHANGE LATER!! **
		doc.day = day;
		doc.tasks = week[day];
		docs.push(doc);
	}
	db.weekItems.insert(docs, function (err, doc) {
			res.json(doc);
		});
	
});


app.listen(3000);
console.log("Server running on port 3000");