# feeder

A Node server app that hooks the <a href="https://github.com/scripting/reallysimple">reallysimple</a> package up to the web.

### Why?

To provide service to Drummer and possibly other apps that run in the browser.

### Two calls

There are two calls supported: /returnjson and /returnopml. Both take a <i>url</i> parameter. 

http://feeder.scripting.com/returnjson?url=http://scripting.com/rss.xml 

* Returns a JSON structure containing the information in the feed, as processed by reallysimple. 

http://feeder.scripting.com/returnopml?url=http://scripting.com/rss.xml 

* Returns an OPML structure which you can insert into an outline, with all the items from the feed. 

These calls are used from Drummer to implement the rss.readFeed verb and to allow expanding of <i>rss</i> node types. 

### Caveats

If you're deploying a real application, please run your own copy of this app. 

It's fine to use feeder.scripting.com for testing. 

### Questions or comments

Please respond in <a href="https://github.com/scripting/reallysimple/issues/1">this thread</a> on the reallysimple issues section. 

