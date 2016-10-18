"use strict";

define(function (require, exports, module) {

	module.exports = function (el) {

		//TODO: The .html method should be renamed. The .write method should have a public wrapper.
		//TODO: Update with ES6 syntax
		//TODO: Add transpiler
		//TODO: Fix unit tests and example HTML file

		// Create and attach the iframe
		this.iframe = document.createElement('iframe');
		el.appendChild(this.iframe);

		// Write to the iframe
		this.write = (html) => {
			this.iframe.contentWindow.document.open("text/html", "replace");
			this.iframe.contentWindow.document.write(html); // Rendering starts during/after the write() command (depending on browser)
			this.iframe.contentWindow.document.close(); // Rendering is not necessarily finished when close() is called
			return this;
		};

		this.state = '';

		this.setAttributes = (elem, attrs) => {
			for (var key in attrs) {
				elem.setAttribute(key, attrs[key]);
			}
			return elem;
		};

		this.appendElementHead = (elem) => {
			var dummy = document.createElement('html');
			dummy.innerHTML = this.state;
			dummy.getElementsByTagName('head')[0].appendChild(elem);
			this.state = dummy.innerHTML;
			return this;
		};

		this.appendElementBody = (elem) => {
			var dummy = document.createElement('html');
			dummy.innerHTML = this.state;
			dummy.getElementsByTagName('body')[0].appendChild(elem);
			this.state = dummy.innerHTML;
			return this;
		};

		// Add script to HTML
		this.addScript = (scriptContent, scriptAttributes, isBody) => {
			// Create script element
			var script = document.createElement('script');
			script = this.setAttributes(script, scriptAttributes);
			if (scriptContent != null) {
				script.textContent = scriptContent;
			}
			if (isBody) {
				return this.appendElementBody(script)
			} else {
				return this.appendElementHead(script)
			}
		};

		// Find and replace
		this.findAndReplace = (tag, callback) => {
			var dummy = document.createElement('html');
			dummy.innerHTML = this.state;
			var collection = dummy.getElementsByTagName(tag);
			for (var index in collection) {
				if (collection.hasOwnProperty(index)) {
					if (index !== 'length') {
						callback(collection[index]);
					}
				}
			}
			this.state = dummy.innerHTML;
			return this;
		};

		/* PUBLIC API */

		this.html = (html) => {
			if (typeof(html) === 'undefined') {
				return this.state;
			}
			this.state = html;
			return this;
		};

		// Add script to head
		this.addScriptHead = (scriptContent, scriptAttributes) => {
			if (typeof scriptAttributes === "undefined") {
				scriptAttributes = {};
			}
			return this.addScript(scriptContent, scriptAttributes, false);
		};

		// Add script to body
		this.addScriptBody = (scriptContent, scriptAttributes) => {
			if (typeof scriptAttributes === "undefined") {
				scriptAttributes = {};
			}
			return this.addScript(scriptContent, scriptAttributes, true);
		};

		// Add style
		this.addStyle = (cssString) => {
			// Create style element
			var style = document.createElement('style');
			style.textContent = cssString;
			return this.appendElementHead(style)
		};

		this.addFile = (data, type) => {
			switch (type) {
				case 'html':
					this.html(data);
					break;
				case 'css':
					this.addStyle(data);
					break;
				case 'js':
					this.addScriptBody(data);
					break;
			}
		};

		return this;

	};

});
