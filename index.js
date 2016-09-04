

"use strict";

module.exports = function(el) {

	// Create and attach the iframe
	this.iframe = document.createElement('iframe');
	parentElement.appendChild(el);
	
	// Write to the iframe
	this.write = (html) => {
		this.iframe.contentWindow.document.open("text/html", "replace");
		this.iframe.contentWindow.document.write(html); // Rendering starts during/after the write() command (depending on browser)
		this.iframe.contentWindow.document.close(); // Rendering is not necessarily finished when close() is called
		return this;
	};

	this.state = '';

	this.html = (html) => {
		if (typeof(html) === 'undefined') {
			return this.state;
		}
		this.state = html;
		return this;
	};

	this.setAttributes = (elem, attrs) => {
		for (var key in attrs) {
			elem.setAttribute(key, attrs[key]);
		}
		return elem;
	}

	this.appendElementHead = (elem) => {
		var dummy = document.createElement('html');
		dummy.innerHTML = this.state;
		dummy.getElementsByTagName('head')[0].appendChild(elem);
		this.state = dummy.innerHTML;
		return this;
	}

	this.appendElementBody = (elem) => {
		var dummy = document.createElement('html');
		dummy.innerHTML = this.state;
		dummy.getElementsByTagName('body')[0].appendChild(elem);
		this.state = dummy.innerHTML;
		return this;
	}

	// Add script to HTML
	this.addScript = (scriptContent, scriptAttributes, isBody) => {
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
	this.addScriptHead = (scriptContent, scriptAttributes) => {
		if (typeof scriptAttributes === "undefined") {
			scriptAttributes = {};
		}
		return addScript(scriptContent, scriptAttributes, false);
	};

	// Add script to body
	this.addScriptBody = (scriptContent, scriptAttributes) => {
		if (typeof scriptAttributes === "undefined") {
			scriptAttributes = {};
		}
		return addScript(scriptContent, scriptAttributes, true);
	};

	// Add style
	this.addStyle = (cssString) => {
		// Create style element
		var style = document.createElement('style');
		style.textContent = cssString;
		return appendElementHead(style)
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
	}

	return this;

};
