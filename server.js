var express = require('express'),
	path = require('path'),
	port = process.env.PORT,
	app = express(),
	config = require('./config/init');

require('./config/express')(express, app, config);

/*
	Webform routes for app version 1.3
*/
app.get('/appointivwebform/:uniqueKey/booking', function(request, response){
	response.sendFile(path.join(__dirname + '/public/normalwebform/index.html'));
});

require('./route/home/homeRoute')(app);

require('./middlewares/errorHandler')(app);

var server = app.listen(port , function() {
    console.log("Listening on "+port);
});