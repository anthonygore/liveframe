(function () {

	"use strict";

	window.liveframe = window.liveframe || {};

	liveframe.Controller = function () {

		var context = this;

		this.iframe = {};

		// Create and attach the iframe
		this.create = function (parentElement) {
			this.iframe = document.createElement('iframe');
			parentElement.appendChild(this.iframe);
			return this;
		};

		// Write to the iframe
		this.write = function (html) {
			this.iframe.contentWindow.document.open("text/html", "replace");
			this.iframe.contentWindow.document.write(html); // Rendering starts during/after the write() command (depending on browser)
			this.iframe.contentWindow.document.close(); // Rendering is not necessarily finished when close() is called
			return this;
		};

	};


	liveframe.DummyDom = function () {

		var context = this;

		this.state = '';

		this.html = function (html) {
			if (typeof(html) === 'undefined') {
				return this.state;
			}
			this.state = html;
			return context;
		};

		function setAttributes(elem, attrs) {
			for (var key in attrs) {
				elem.setAttribute(key, attrs[key]);
			}
			return elem;
		}

		function appendElementHead(elem) {
			var dummy = document.createElement('html');
			dummy.innerHTML = context.state;
			dummy.getElementsByTagName('head')[0].appendChild(elem);
			context.state = dummy.innerHTML;
			return context;
		}

		function appendElementBody(elem) {
			var dummy = document.createElement('html');
			dummy.innerHTML = context.state;
			dummy.getElementsByTagName('body')[0].appendChild(elem);
			context.state = dummy.innerHTML;
			return context;
		}

		// Add script to HTML
		function addScript(scriptContent, scriptAttributes, isBody) {
			// Create script element
			var script = document.createElement('script');
			script = setAttributes(script, scriptAttributes);
			if (scriptContent != null) {
				script.textContent = scriptContent;
			}
			if (isBody) {
				return appendElementBody(script)
			} else {
				return appendElementHead(script)
			}
		}

		// Add script to head
		this.addScriptHead = function (scriptContent, scriptAttributes) {
			if (typeof scriptAttributes === "undefined") {
				scriptAttributes = {};
			}
			return addScript(scriptContent, scriptAttributes, false);
		};

		// Add script to body
		this.addScriptBody = function (scriptContent, scriptAttributes) {
			if (typeof scriptAttributes === "undefined") {
				scriptAttributes = {};
			}
			return addScript(scriptContent, scriptAttributes, true);
		};

		// Add style
		this.addStyle = function (cssString) {
			// Create style element
			var style = document.createElement('style');
			style.textContent = cssString;
			return appendElementHead(style)
		};

		// Find and replace
		this.findAndReplace = function (tag, callback) {
			var dummy = document.createElement('html');
			dummy.innerHTML = context.state;
			var collection = dummy.getElementsByTagName(tag);
			for (var index in collection) {
				if (collection.hasOwnProperty(index)) {
					if (index !== 'length') {
						callback(collection[index]);
					}
				}
			}
			context.state = dummy.innerHTML;
			return context;
		}

	};


})();
