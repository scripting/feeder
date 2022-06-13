const myVersion = "0.4.5", myProductName = "feeder";    

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const reallysimple = require ("reallysimple");

var config = {
	port: process.env.PORT || 1403,
	flAllowAccessFromAnywhere: true,
	flLogToConsole: true,
	defaultFeedUrl: "http://nytimes.com/timeswire/feeds/",
	fnameStats: "stats.json"
	}

var stats = {
	ctLaunches: 0,
	whenLastLaunch: undefined,
	ctFeedReads: 0,
	whenLastFeedRead: undefined,
	ctFeedReadErrors: 0,
	whenLastFeedReadError: undefined,
	ctSecsLastRequest: undefined,
	feeds: new Object ()
	}
var flStatsChanged = false;

function statsChanged () {
	flStatsChanged = true;
	}
function readFeed (feedUrl=config.defaultFeedUrl, callback) {
	const whenstart = new Date ();
	reallysimple.readFeed (feedUrl, function (err, theFeed) {
		stats.ctFeedReads++;
		stats.whenLastFeedRead = whenstart;
		stats.ctSecsLastRequest = utils.secondsSince (whenstart);
		if (err) {
			stats.ctFeedReadErrors++;
			stats.whenLastFeedReadError = whenstart;
			callback (err);
			}
		else {
			if (stats.feeds [feedUrl] === undefined) {
				stats.feeds [feedUrl] = {
					ct: 1,
					when: whenstart
					}
				}
			else {
				let thisFeed = stats.feeds [feedUrl];
				thisFeed.ct++;
				thisFeed.when = whenstart;
				}
			callback (undefined, theFeed);
			}
		statsChanged ();
		});
	}
function readConfig (f, config, callback) {
	fs.readFile (f, function (err, jsontext) {
		if (!err) {
			try {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					config [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log ("Error reading " + f);
				}
			}
		callback ();
		});
	}
function everySecond () {
	if (flStatsChanged) {
		flStatsChanged = false;
		fs.writeFile (config.fnameStats, utils.jsonStringify (stats), function (err) {
			});
		}
	}

readConfig (config.fnameStats, stats, function () {
	stats.ctLaunches++;
	stats.whenLastLaunch = new Date ();
	statsChanged ();
	davehttp.start (config, function (theRequest) {
		var params = theRequest.params;
		function returnNotFound () {
			theRequest.httpReturn (404, "text/plain", "Not found.");
			}
		function returnOpml (opmltext) {
			theRequest.httpReturn (200, "text/xml; charset=utf-8", opmltext); //6/13/22 by DW
			}
		function returnError (jstruct) {
			theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
			}
		function returnData (jstruct) {
			if (jstruct === undefined) {
				jstruct = {};
				}
			theRequest.httpReturn (200, "application/json; charset=utf-8", utils.jsonStringify (jstruct)); //6/13/22 by DW
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
	setInterval (everySecond, 1000); 
	});
