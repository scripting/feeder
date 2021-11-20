const myVersion = "0.4.1", myProductName = "feeder"; 

const fs = require ("fs");
const utils = require ("daveutils");
const feedRead = require ("davefeedread");
const davehttp = require ("davehttp");
const opml = require ("opml");

var config = {
	port: process.env.PORT || 1801,
	flLogToConsole: true,
	flAllowAccessFromAnywhere: true,
	timeOutSecs: 3
	}

const allowedHeadNames = [
	"title", "link", "description", "language", "copyright", "managingEditor", "webMaster", "lastBuildDate", "pubDate", "category",
	"generator", "docs", "cloud", "ttl", "image", "rating", "textInput", "skipHours", "skipDays", "source:account", "source:localtime", 
	"source:likes"
	];
const allowedItemNames = [
	"title", "link", "description", "author", "category", "comments", "enclosure", "guid", "pubDate", "source"
	];

function isEmptyObject (obj) {
	return (Object.keys (obj).length === 0);
	}

function getItemPermalink (item) { //cribbed from River6, we're going to crib other stuff too ;-)
	var rssguid = item ["rss:guid"], returnedval = undefined;
	if (rssguid !== undefined) {
		var atts = rssguid ["@"];
		if (atts.ispermalink === undefined) {
			returnedval = rssguid ["#"];
			}
		else {
			if (utils.getBoolean (atts.ispermalink)) {
				returnedval = rssguid ["#"];
				}
			}
		}
	if (returnedval !== undefined) {
		if (utils.beginsWith (returnedval, "http")) {
			return (returnedval);
			}
		}
	return (undefined);
	}

function convertFeed (oldFeed) {
	var newFeed = new Object ();
	for (var x in oldFeed.head) {
		let val = oldFeed.head [x];
		if (val != null) {
			allowedHeadNames.forEach (function (name) {
				if (x == name) {
					newFeed [x] = val;
					}
				});
			}
		}
	if (isEmptyObject (newFeed.image)) {
		delete newFeed.image;
		}
	
	newFeed.items = new Array ();
	oldFeed.items.forEach (function (item) {
		var newItem = new Object ();
		for (var x in item) {
			val = item [x];
			if (val != null) {
				allowedItemNames.forEach (function (name) {
					if (x == name) {
						newItem [x] = val;
						}
					});
				}
			}
		newItem.guid = getItemPermalink (item);
		if (isEmptyObject (newItem.source)) {
			delete newItem.source;
			}
		newFeed.items.push (newItem);
		});
	
	return (newFeed);
	}
function convertToOpml (theFeed) {
	var theOutline = {
		opml: {
			head: {
				title: theFeed.title
				},
			body: {
				subs: new Array ()
				}
			}
		}
	theFeed.items.forEach (function (item) {
		var linetext, subtext;
		if (item.title === undefined) {
			linetext = item.description;
			}
		else {
			linetext = item.title;
			subtext = item.description;
			}
		theOutline.opml.body.subs.push ({
			text: linetext,
			type: "link",
			url: item.link
			});
		});
	return (opml.stringify (theOutline));
	}

function readFeed (url, callback) {
	feedRead.parseUrl (url, config.timeOutSecs, function (err, theFeed) {
		if (err) {
			callback (err);
			}
		else {
			callback (undefined, convertFeed (theFeed));
			}
		});
	}
function viewHomePage (feedUrl, callback) {
	
	
	readFeed (feedUrl, function (err, theFeed) {
		if (err) {
			callback (err.message);
			}
		else {
			fs.readFile ("template.html", function (err, templatetext) {
				if (err) {
					callback (err.message);
					}
				else {
					var pagetable = {
						url: feedUrl,
						bodytext: utils.jsonStringify (theFeed)
						};
					var htmltext = utils.multipleReplaceAll (templatetext.toString (), pagetable, false, "[%", "%]");
					callback (htmltext);
					}
				});
			}
		});
	
	}

davehttp.start (config, function (theRequest) {
	function returnHtml (htmltext) {
		theRequest.httpReturn (200, "text/html", htmltext);
		}
	function returnOpml (opmltext) {
		theRequest.httpReturn (200, "text/xml", opmltext);
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
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
			viewHomePage (theRequest.params.url, returnHtml);
			return;
		case "/now":
			theRequest.httpReturn (200, "text/plain", new Date ().toUTCString ());
			return;
		case "/returnjson":
			readFeed (theRequest.params.url, httpReturn);
			return;
		case "/returnopml":
			readFeed (theRequest.params.url, function (err, theFeed) {
				if (err) {
					returnError (err);
					}
				else {
					returnOpml (convertToOpml (theFeed));
					}
				});
			return;
		default:
			theRequest.httpReturn (404, "text/plain", "Not found.");
			return;
		}
	});
