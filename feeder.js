const myVersion = "0.4.3", myProductName = "feeder";    

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const reallysimple = require ("reallysimple");

var config = {
	port: process.env.PORT || 1403,
	flAllowAccessFromAnywhere: true,
	flLogToConsole: true,
	defaultFeedUrl: "http://nytimes.com/timeswire/feeds/"
	}

function readFeed (feedUrl=config.defaultFeedUrl, callback) {
	reallysimple.readFeed (feedUrl, callback);
	}

davehttp.start (config, function (theRequest) {
	var params = theRequest.params;
	function returnNotFound () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function returnOpml (opmltext) {
		theRequest.httpReturn (200, "text/xml", opmltext);
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function httpReturn (err, jstruct) {
		if (err) {
			returnError (err);
			}
		else {
			returnData (jstruct);
			}
		}
	switch (theRequest.lowerpath) {
		case "/":
		case "/returnjson": 
			readFeed (params.url, httpReturn);
			break;
		case "/returnopml":
			readFeed (params.url, function (err, theFeed) {
				if (err) {
					returnError (err);
					}
				else {
					returnOpml (reallysimple.convertFeedToOpml (theFeed));
					}
				});
			break;
		default:
			returnNotFound ();
			break;
		}
	});
