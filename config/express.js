var bodyParser = require('body-parser'),
	helmet = require('helmet'),
	timeout = require('connect-timeout');

module.exports = function(express, app, config) {
	
	var allowCrossDomain = function(req, res, next) {
	
		res.setHeader('access-control-allow-origin', '*');
		res.setHeader('access-control-allow-methods', 'POST, GET, PUT, DELETE, OPTIONS');
		res.setHeader('access-control-allow-headers', 'accept, Authorization, Content-Type, Content-Length, X-Requested-With, X-HTTP-Method-Override');
		res.setHeader('content-type', 'application/json');
		res.setHeader('Access-Control-Max-Age', '86400');
		return next();		
		
		next();
	};	
	
	app.use(helmet());

	app.use('/common', express.static(config.rootPath + '/public/staticResources', { maxAge: 86400000 }));

	app.use(timeout('22s'));
	app.use(bodyParser.json({limit: '5mb'}));
	app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
	app.use(allowCrossDomain);
}
