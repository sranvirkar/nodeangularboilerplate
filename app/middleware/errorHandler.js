module.exports = function(app) {

	app.use(function(req, res) {
		res.status(404);
		
		console.log("404 ",req.headers);
		
		// respond with html page
		if (req.accepts('html')) {
			res.render('404page');
			return;
		}
		// respond with json
		if (req.accepts('json')) {
			res.send({ error: 'Not found' });
			return;
		}
		// default to plain-text. send()
		res.type('txt').send('Not found');
	});
	
	app.use(function(req, res, next) {
		console.log(req.timedout, "req.timedout error handling");
		if (!req.timedout){
			next();
		}else{
			console.log("timeout error comming in error handler.");
		}
	});

	app.use(function(err, req, res, next) {		
		res.status(err.status || 500);
		// respond with html page

		//console.log("req accept",req.accepts('json'));
		//console.log("req",req["headers"]);

		if (req["headers"]["accept"].indexOf("application/json") != -1) {
			res.send({message: err.message,error: err});
			return;
		}
		// respond with json
		if (req["headers"]["accept"].indexOf("text/html") != -1) {
			res.render('errorpage',{message: err.message,error: err});
			return;
		}
		// default to plain-text. send()
		res.type('txt').send(err.message);
	});
}
