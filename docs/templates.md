# Templates

The basic function of feeder is to provide an HTTP interface to the reallysimple package, so you can access its functionality from a browser-based app without having to run a server. 

You an also run the contents of a reallysimple query through a template, which is just a web page, which has the result of the query as a local object you can use JavaScript to render.

This page walks you through the Hello World template first, it's a tour of the basic features. 

### The Hello World template

This is the <a href="https://github.com/scripting/feeder/blob/main/templates/helloworld.html">template</a>. I suggest keeping this open in a tab for reference.

This is how you invoke it:

<a href="http://feeder.scripting.com/?template=helloworld&feedurl=https://news.ycombinator.com/rss">http://feeder.scripting.com/?template=helloworld&feedurl=https://news.ycombinator.com/rss</a>

I suggest opening that url in a browser, do a view source and leave that open in a tab.

The template refers to 3 macros which are filled in by the feeder app before it serves it.

1. [%feedTitle%] -- the title of the feed, displayed in the &lt;title> element in the HTML.

2. [%config%] -- configuration info from the server, assigned to a local variable <i>config.</i>

3. [%feedJsonText%] -- the JSON object returned by the reallysimple package, assigned to a local variable, theFeed

From there, the primary job of the template is to display and allow the user to interact with the contents of the feed, which is accessed locally through <i>theFeed,</i> which is just a JavaScript object. 

<i>config</i> is there mostly for the future, if there's information we might want to send to all templates from the server that's hosting the template. Initially it just has the name of the feeder app and its version. 

The Hello World app just displays what's in theFeed by strigifying it and assigning it to the <i>idFeedInfo</i> DOM object. 

### The Titled Items template

This template displays items that have titles and links to their &lt;link> value, if it has one. 

This is how you invoke it:

http://feeder.scripting.com/?template=titleditems&feedurl=https://news.ycombinator.com/rss

Here's the code that builds the list.

```JavaScriptfunction viewTitledItems () {	var htmltext = "";	function add (s) {		htmltext += s + "\n";		}	add ("<ul>"); 	theFeed.items.forEach (function (item) {		if (item.title !== undefined) {			var link = item.title;			if (item.link !== undefined) {				link = "<a href=\"" + item.link + "\">" + link + "</a>";				}			add ("<li>" + link + "</li>");			}		});	add ("</ul>"); 	return (htmltext);	}```

This is the punchline for the whole reallysimple stack up to this point. The goal was to make using info from a feed as simple as working with a JavaScript object. At this point you have the full power of JavaScript and the web to work with the info in a feed. 

