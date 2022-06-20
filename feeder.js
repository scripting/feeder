const myVersion = "0.4.6", myProductName = "feeder";    

const fs = require ("fs");
const utils = require ("daveutils");
const request = require ("request"); 
const davehttp = require ("davehttp"); 
const reallysimple = require ("reallysimple");

var config = {
	port: process.env.PORT || 1403,
	flAllowAccessFromAnywhere: true,
	flLogToConsole: true,
	defaultFeedUrl: "http://nytimes.com/timeswire/feeds/",
	fnameStats: "stats.json",
	urlMailboxTemplate: "http://scripting.com/code/river6/templates/feedviewer/index.html",
	viewersFolderPath: "viewers/"
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
function viewFeedInTemplate (feedUrl, viewerName, callback) { //6/20/22 by DW
	function servePage (templatetext, theFeed) {
		var pagetable = {
			productNameForDisplay: myProductName, 
			version: myVersion,
			feedTitle: theFeed.title,
			config: utils.jsonStringify ({}), //a feature we aren't using
			riverJsonText: utils.jsonStringify (theFeed) //probably shouldn't call this "river," it's just a feed not a river
			};
		var pagetext = utils.multipleReplaceAll (templatetext.toString (), pagetable, false, "[%", "%]");
		callback (pagetext);
		}
	readFeed (feedUrl, function (err, theFeed) {
		var flnotfound = true, lowerViewerName = utils.stringLower (viewerName);
		utils.sureFolder (config.viewersFolderPath, function () {
			var f = config.viewersFolderPath + viewerName + ".html";
			fs.readFile (f, function (err, templatetext) {
				if (err) {
					callback ("Can't view the feed because there was an error reading the viewer.");
					}
				else {
					servePage (templatetext, theFeed);
					}
				});
			});
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
		function returnHtml (htmltext) {
			theRequest.httpReturn (200, "text/html; charset=utf-8", htmltext); //6/13/22 by DW
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
		function returnRedirect (url) {
			const code = 302;
			theRequest.httpReturn (code, "text/plain", code + " REDIRECT", {location: url});
			}
			
		function mailboxRedirect () {
			var newUrl = "/?template=mailbox";
			if (params.url !== undefined) {
				newUrl += "&url=" + params.url;
				}
			returnRedirect (newUrl);
			}
		switch (theRequest.lowerpath) {
			case "/": //6/20/22 by DW
				viewFeedInTemplate (params.url, params.template, returnHtml);
				break;
			case "/stats": 
				returnData (stats); 
				break;
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
			case "/returnmailbox": //6/18/22 by DW
				mailboxRedirect ();
				break;
			default:
				returnNotFound ();
				break;
			}
		});
	setInterval (everySecond, 1000); 
	});
