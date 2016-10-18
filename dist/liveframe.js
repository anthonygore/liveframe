"use strict";

define(function (require, exports, module) {

	module.exports = function (el) {
		var _this = this;

		//TODO: The .html method should be renamed. The .write method should have a public wrapper.
		//TODO: Update with ES6 syntax
		//TODO: Add transpiler
		//TODO: Fix unit tests and example HTML file

		// Create and attach the iframe
		this.iframe = document.createElement('iframe');
		el.appendChild(this.iframe);

		// Write to the iframe
		this.write = function (html) {
			_this.iframe.contentWindow.document.open("text/html", "replace");
			_this.iframe.contentWindow.document.write(html); // Rendering starts during/after the write() command (depending on browser)
			_this.iframe.contentWindow.document.close(); // Rendering is not necessarily finished when close() is called
			return _this;
		};

		this.state = '';

		this.setAttributes = function (elem, attrs) {
			for (var key in attrs) {
				elem.setAttribute(key, attrs[key]);
			}
			return elem;
		};

		this.appendElementHead = function (elem) {
			var dummy = document.createElement('html');
			dummy.innerHTML = _this.state;
			dummy.getElementsByTagName('head')[0].appendChild(elem);
			_this.state = dummy.innerHTML;
			return _this;
		};

		this.appendElementBody = function (elem) {
			var dummy = document.createElement('html');
			dummy.innerHTML = _this.state;
			dummy.getElementsByTagName('body')[0].appendChild(elem);
			_this.state = dummy.innerHTML;
			return _this;
		};

		// Add script to HTML
		this.addScript = function (scriptContent, scriptAttributes, isBody) {
			// Create script element
			var script = document.createElement('script');
			script = _this.setAttributes(script, scriptAttributes);
			if (scriptContent != null) {
				script.textContent = scriptContent;
			}
			if (isBody) {
				return _this.appendElementBody(script);
			} else {
				return _this.appendElementHead(script);
			}
		};

		// Find and replace
		this.findAndReplace = function (tag, callback) {
			var dummy = document.createElement('html');
			dummy.innerHTML = _this.state;
			var collection = dummy.getElementsByTagName(tag);
			for (var index in collection) {
				if (collection.hasOwnProperty(index)) {
					if (index !== 'length') {
						callback(collection[index]);
					}
				}
			}
			_this.state = dummy.innerHTML;
			return _this;
		};

		/* PUBLIC API */

		this.html = function (html) {
			if (typeof html === 'undefined') {
				return _this.state;
			}
			_this.state = html;
			return _this;
		};

		// Add script to head
		this.addScriptHead = function (scriptContent, scriptAttributes) {
			if (typeof scriptAttributes === "undefined") {
				scriptAttributes = {};
			}
			return _this.addScript(scriptContent, scriptAttributes, false);
		};

		// Add script to body
		this.addScriptBody = function (scriptContent, scriptAttributes) {
			if (typeof scriptAttributes === "undefined") {
				scriptAttributes = {};
			}
			return _this.addScript(scriptContent, scriptAttributes, true);
		};

		// Add style
		this.addStyle = function (cssString) {
			// Create style element
			var style = document.createElement('style');
			style.textContent = cssString;
			return _this.appendElementHead(style);
		};

		this.addFile = function (data, type) {
			switch (type) {
				case 'html':
					_this.html(data);
					break;
				case 'css':
					_this.addStyle(data);
					break;
				case 'js':
					_this.addScriptBody(data);
					break;
			}
		};

		return this;
	};
});
