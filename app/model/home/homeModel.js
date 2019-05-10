/*
*	Import all the required modules
**/
var Promise = require('promise');
var cronofy = require('cronofy');
var requestModule = require('request');
var externalCalUserModel = require('./externalCalModel').ExternalCalUserModel;
var appUtility = require('../helpers/utilityMethods');

// Main custructor function
function CronofyModel(){
	this.serverResponse = {
		'success': 0,
		'error': 0,
		'response': {}
	}
};

/**
*	Method used to create event in External calendar
*/
CronofyModel.prototype.createEvent = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.createEvent(option, function(err, response){
				if(err){				
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to delete event from External calendar
*/
CronofyModel.prototype.deleteEvent = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	console.log("delete event params ", option);
	return new Promise(function(resolve, reject){
		try{
			cronofy.deleteEvent(option, function(err, response){
				if(err){
					console.log(err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to delete bulk events.
*/
CronofyModel.prototype.deleteBulkEvent = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{		
			requestModule({
				uri: "https://api.cronofy.com/v1/events",
				method: "DELETE",
				headers:{
					"Content-Type": "application/json; charset=utf-8",
					"Authorization": "Bearer "+option.access_token
				},
				body: JSON.stringify(option)
			}, function(error, res, body){
				console.log("res.statusCode ",res.statusCode);
				if (!error && (res.statusCode == 200 || res.statusCode == 202)) {
					console.log("resolved");
					//All is good. Print the body
					that.serverResponse.success = 1;
					that.serverResponse.response = body;
					resolve(that.serverResponse);					
				}else if(error){
					console.log("rejected");
					that.serverResponse.error = 1;
					that.serverResponse.response = {'Error': error};
					reject(that.serverResponse);
				}else if(res.statusCode !== 200 && res.statusCode !== 202){
					console.log("rejected");
					that.serverResponse.error = 1;
					that.serverResponse.response = {'statusCode':res.statusCode,'body':body, 'res': res};
					reject(that.serverResponse);			
				}				
			});			
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to read events from External calendar
*/
CronofyModel.prototype.readEvents = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.readEvents(option, function(err, response){
				if(err){
					console.log("readEvents err",err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					console.log("readEvents success");
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			console.log("readEvents try catch err",err);
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to read page events.
*/
CronofyModel.prototype.readEventsByPage = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{		
			requestModule({
				uri: option.url,
				method: "GET",
				headers:{
					"Content-Type": "application/json;",
					"Authorization": "Bearer "+option.access_token
				}
			}, function(error, res, body){
				console.log("res.statusCode ",res.statusCode);
				if (!error && res.statusCode == 200) {
					console.log("resolved");
					//All is good. Print the body
					that.serverResponse.success = 1;
					that.serverResponse.response = body;
					resolve(that.serverResponse);					
				}else if(error){
					console.log("rejected");
					that.serverResponse.error = 1;
					that.serverResponse.response = {'Error': error};
					reject(that.serverResponse);
				}else if(res.statusCode !== 200){
					console.log("rejected");
					that.serverResponse.error = 1;
					that.serverResponse.response = {'statusCode':res.statusCode,'body':body, 'res': res};
					reject(that.serverResponse);			
				}				
			});			
		} catch(err){
			console.log("readEvents try catch err",err);
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to read all the chunked events from external cal
*/
CronofyModel.prototype.readAllPageEvents = function(pageOpt, filteredEvents, orgDetails){	
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	var getFilteredEvents = function(evt){
		var evtArr = [];
		for(var i=0; i<evt.length; i++){
			var createUnavailability = appUtility.cronofyEventAvailabilityCheck(evt[i]);
			if(createUnavailability){
				var obj = evt[i];
				obj["orgId"] = orgDetails.orgid;
				obj["contact_id"] = orgDetails.contactid;
				evtArr.push(obj);																					
			}
		}
		return evtArr;
	};
	
	return new Promise(function(resolve, reject){
		that.readEventsByPage(pageOpt).then(function(eventPageResp){
			var response = JSON.parse(eventPageResp.response);
			console.log(response.pages);
			if(response.pages){
				if(response.pages.current === response.pages.total){
					console.log("response.pages.current === response.pages.total ", response.pages.current === response.pages.total);
					filteredEvents = filteredEvents.concat(getFilteredEvents(response.events));
					console.log("filteredEvents.length ", filteredEvents.length);
					resolve({stopLoop: true, events: filteredEvents});
				}else{
					filteredEvents = filteredEvents.concat(getFilteredEvents(response.events));
					var opt = {
						url: response.pages.next_page,
						access_token: pageOpt.access_token
					};
					console.log("opt ....", opt);
					resolve(opt);
				}
			}else{
				filteredEvents = filteredEvents.concat(getFilteredEvents(response.events));
				resolve({stopLoop: true, events: filteredEvents});
			}
		}, function(eventPageErr){
			reject(eventPageErr);
		});
	}).then(function(resp){
		if(resp.stopLoop){
			console.log("resp.... ",resp);
			return resp.events;
		}else{
			console.log("resp ",resp);
			return that.readAllPageEvents(resp, filteredEvents, orgDetails);
		}
	}, function(err){
		return err;
	});
};

/**
*	Method used to access request token of External calendar
*/
CronofyModel.prototype.refreshAccessTokenTest = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.refreshAccessToken(option, function(err, response){
				if(err){
					console.log("refreshAccessTokenTest error",err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{				
					console.log("refreshAccessTokenTest success");
					that.serverResponse.success = 1;
					that.serverResponse.response = {
						accesstoken:response.access_token
					};
					resolve(that.serverResponse);				
				}
			});
		} catch(err){
			console.log("refreshAccessTokenTest try catch error", err);
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to create Notification Channel.
*/
CronofyModel.prototype.createNotificationChannel = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;	
	return new Promise(function(resolve, reject){
		try{
			cronofy.createNotificationChannel(option, function(err, response){
				if(err){
					console.log(err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to delete Notification Channel.
*/
CronofyModel.prototype.deleteNotificationChannel = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.deleteNotificationChannel(option, function(err, response){
				if(err){
					console.log(err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

/**
*	Method used to revokeAuthorization.
*/
CronofyModel.prototype.revokeAuthorization = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.revokeAuthorization(option, function(err, response){
				if(err){
					console.log(err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

CronofyModel.prototype.listNotificationChannels = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.listNotificationChannels(option, function(err, response){
				if(err){
					console.log(err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

CronofyModel.prototype.getAuthorazationUrl = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			var url = "https://app.cronofy.com/oauth/authorize?response_type=code&client_id="+option.cliendId+"&redirect_uri="+option.redirectUrl+"&scope="+option.scope+"&avoid_linking="+option.avoid_linking+"&state="+option.state;
			that.serverResponse.success = 1;
			that.serverResponse.response = {url:url};
			resolve(that.serverResponse);
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(that.serverResponse);
		}
	});
};

CronofyModel.prototype.requestAccessToken = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.requestAccessToken(option, function(err, response){
				if(err){
					console.log("err", err);
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(serverResponse);
		}
	});
};

CronofyModel.prototype.listCalendars = function(option){
	var that = this;
	that.serverResponse.success = 0;
	that.serverResponse.error = 0;
	return new Promise(function(resolve, reject){
		try{
			cronofy.listCalendars(option, function(err, response){
				if(err){
					that.serverResponse.error = 1;
					that.serverResponse.response = err.status;
					reject(that.serverResponse);
				}else{
					that.serverResponse.success = 1;
					that.serverResponse.response = response;
					resolve(that.serverResponse);
				}
			});
		} catch(err){
			that.serverResponse.error = 1;
			that.serverResponse.response = err.message;
			reject(serverResponse);
		}
	});
};

module.exports.CronofyModel = new CronofyModel();