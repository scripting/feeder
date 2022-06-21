* <a name="a0"></a>6/21/22; 11:32:20 AM by DW-- v0.4.7 <a href="#a0">#</a>
   * <a name="a1"></a>the helloworld template <a href="#a1">#</a>
      * <a name="a2"></a>it's in the templates folder <a href="#a2">#</a>
      * <a name="a3"></a>here's how you access it <a href="#a3">#</a>
         * <a name="a4"></a><a href="http://feeder.scripting.com/?template=helloworld&feedurl=http%3A%2F%2Fscripting.com%2Frss.xml">http://feeder.scripting.com/?template=helloworld&feedurl=http%3A%2F%2Fscripting.com%2Frss.xml</a> <a href="#a4">#</a>
      * <a name="a5"></a>have a look at the template source. <a href="#a5">#</a>
      * <a name="a6"></a>i made it as simple as possible, but I did use jQuery. It wasn't worth the time imho to figure out how to not use jQuery. ;-) <a href="#a6">#</a>
      * <a name="a7"></a>The next step is to do a bit of docs. Need a fresh start for that.  <a href="#a7">#</a>
      * <a name="a8"></a>And then I want to get some people reviewing this stuff. I don't want all the suggestions to come two months from now.  <a href="#a8">#</a>
      * <a name="a9"></a>We still have a lot of ground to cover, this is just the beginning. <a href="#a9">#</a>
* <a name="a10"></a>6/20/22; 12:21:34 PM by DW -- v0.4.6 <a href="#a10">#</a>
   * <a name="a11"></a>feeder now supports templates, so it's easy to add a new way to view a feed.  <a href="#a11">#</a>
   * <a name="a12"></a>here's an example. I implemented the mailbox viewer as a template, it was previously a built-in command. <a href="#a12">#</a>
      * <a name="a13"></a><a href="http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed">http://feeder.scripting.com/?template=mailbox&url=https://fallows.substack.com/feed</a> <a href="#a13">#</a>
   * <a name="a14"></a>there's a viewers subfolder, to add a template named hello, you'd add a file hello.html to the folder. <a href="#a14">#</a>
   * <a name="a15"></a>before serving the text, we do some macro substitutions, with the title of the feed, the name and version number of the feeder app, and most important, a JSON structure with the contents of the feed as produced by the reallysimple package.  <a href="#a15">#</a>
   * <a name="a16"></a>next step -- write a hello world template and document it. this will be clearer when that's provided. <a href="#a16">#</a>
   * <a name="a17"></a>still feeder is just a testbed. these templates will become applications in their own right.  <a href="#a17">#</a>
* <a name="a18"></a>6/13/22; 12:06:18 PM by DW -- v0.4.5 <a href="#a18">#</a>
   * <a name="a19"></a>Include the charset in the content-type header when returning JSON and XML.  <a href="#a19">#</a>
* <a name="a20"></a>6/12/22; 6:56:43 PM by DW -- v0.4.4 <a href="#a20">#</a>
   * <a name="a21"></a>We now keep a stats.json file, with info on number of reads, errors, and reads per feed. <a href="#a21">#</a>
* <a name="a22"></a>6/12/22; 9:52:26 AM by DW <a href="#a22">#</a>
   * <a name="a23"></a>I need this functionality for the reallysimple project.  <a href="#a23">#</a>
   * <a name="a24"></a>This predates the package, it's basically where it was developed. <a href="#a24">#</a>
   * <a name="a25"></a>So I rewrote it to use the package.  <a href="#a25">#</a>
