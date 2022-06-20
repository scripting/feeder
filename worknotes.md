6/20/22; 11:59:45 AM by DW -- v0.4.6

feeder now supports templates, so it's easy to add a new way to view a feed. 

here's an example. I implemented the mailbox viewer as a template, not a built-in command.

<a href="http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed">http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed</a>

there's a viewers subfolder, to add a template named hello, you'd add a file hello.html to the folder.

before serving the text, we do some macro substitutions, with the title of the feed, the name and version number of the feeder app, and most important, a JSON structure with the contents of the feed as produced by the reallysimple package. 

next step -- write a hello world template and document it. this will be clearer when that's provided.

still feeder is just a testbed. these templates will become applications in their own right. 

6/13/22; 12:06:18 PM by DW -- v0.4.5

Include the charset in the content-type header when returning JSON and XML. 

6/12/22; 6:56:43 PM by DW -- v0.4.4

We now keep a stats.json file, with info on number of reads, errors, and reads per feed.

6/12/22; 9:52:26 AM by DW

I need this functionality for the reallysimple project. 

This predates the package, it's basically where it was developed.

So I rewrote it to use the package. 

