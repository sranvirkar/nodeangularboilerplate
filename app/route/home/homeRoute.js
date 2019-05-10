var pg = require('pg'),
	appUtility = require('../helpers/utilityMethods'),
	homeModel = require('../models/home/homeModel.js').HomeModel;

	pg.defaults.ssl = true;
	pg.defaults.poolSize = 20;



module.exports = function(app) {
	
	app.get('/homo', function (request, response) {
		response.send({"result":"success"});
	});
	
	app.post('/home/active_conversation', function (request, response) {
		response.send({"result":"success"});
	});

};	