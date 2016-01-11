Liveframe
=========

A simple javascript library to help with manipulation of an iframe. It works by making edits in a dummy DOM before
inserting it into the iframe and re-rendering.

Pure javascript, no jQuery required.

Use case
--------

Let's say you're creating a live code environment and you want to display the user's input in an iframe:

```javascript
// The 'iframe' object here provides helper functions for creating/updating an iframe
var iframe = new liveframe.Controller();

// Start by creating an actual iframe in the DOM 
//e.g. <div id="parent"></div>
iframe.create(document.getElementById('parent'));

// The 'dummyDom' object is a library of helpers for manipulating an HTML document in preparation for
// insertion into an iframe.
var dummyDom = new liveframe.DummyDom();

var doc = '<!DOCTYPE html><html><head><title>My iframe</title></head><body></body></html>';

// Methods can be chained
dummyDom
    // Initialise it with a string representation of a complete HTML document.
    .html(doc)
    // One advantage of adding a script like this, rather than to a "live" iframe is that it
    // will be called from cache by the browser
    .addScriptHead(null, {src: 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'})
    // This below style/script could be pulled from your live code editor on keyup etc.
    .addStyle('p {color:red; padding-left:50px;}')
    .addScriptBody('$(document).ready(function(){$("body").append("<p>Red text</p>");});')
;

// Write to the iframe
iframe.write(dummyDom.html());
```

License
-------

MIT