* <a name="a0"></a>6/20/22; 12:21:34 PM by DW -- v0.4.6 <a href="#a0">#</a>
   * <a name="a1"></a>feeder now supports templates, so it's easy to add a new way to view a feed.  <a href="#a1">#</a>
   * <a name="a2"></a>here's an example. I implemented the mailbox viewer as a template, it was previously a built-in command. <a href="#a2">#</a>
      * <a name="a3"></a><a href="http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed">http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed</a> <a href="#a3">#</a>
   * <a name="a4"></a>there's a viewers subfolder, to add a template named hello, you'd add a file hello.html to the folder. <a href="#a4">#</a>
   * <a name="a5"></a>before serving the text, we do some macro substitutions, with the title of the feed, the name and version number of the feeder app, and most important, a JSON structure with the contents of the feed as produced by the reallysimple package.  <a href="#a5">#</a>
   * <a name="a6"></a>next step -- write a hello world template and document it. this will be clearer when that's provided. <a href="#a6">#</a>
   * <a name="a7"></a>still feeder is just a testbed. these templates will become applications in their own right.  <a href="#a7">#</a>
* <a name="a8"></a>6/13/22; 12:06:18 PM by DW -- v0.4.5 <a href="#a8">#</a>
   * <a name="a9"></a>Include the charset in the content-type header when returning JSON and XML.  <a href="#a9">#</a>
* <a name="a10"></a>6/12/22; 6:56:43 PM by DW -- v0.4.4 <a href="#a10">#</a>
   * <a name="a11"></a>We now keep a stats.json file, with info on number of reads, errors, and reads per feed. <a href="#a11">#</a>
* <a name="a12"></a>6/12/22; 9:52:26 AM by DW <a href="#a12">#</a>
   * <a name="a13"></a>I need this functionality for the reallysimple project.  <a href="#a13">#</a>
   * <a name="a14"></a>This predates the package, it's basically where it was developed. <a href="#a14">#</a>
   * <a name="a15"></a>So I rewrote it to use the package.  <a href="#a15">#</a>
