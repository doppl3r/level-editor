// This class mixes design patterns from jQuery and ThreeJS Editor (https://github.com/mrdoob/three.js/blob/master/editor/js/libs/ui.js)

class UI {
	constructor(dom, attributes = {}) {
		this.dom = dom;
		if (dom == null || typeof dom == 'string') this.dom = this.createElement(dom);
		if (attributes !== 'undefined') this.attr(null, attributes);
		if (attributes.id == null) this.attr('id', this.generateUUID());
	}

	append() {
		// Append dom elements
		for (let i = 0; i < arguments.length; i++) {
			const argument = arguments[i];
			if (argument instanceof UI) { this.dom.append(argument.dom); }
			else { console.error('UI:', argument, 'is not an instance of UI.'); }
		}
		return this;
	}

	remove() {
		if (arguments.length > 0) {
			for (let i = 0; i < arguments.length; i++) {
				const argument = arguments[i];
				if (argument instanceof UI) { this.dom.removeChild(argument.dom) }
				else { console.error('UI:', argument, 'is not an instance of UI.'); }
			}
		}
		else {
			this.dom.remove();
		}
		return this;
	}

	appendTo(dom) {
		// Append DOM element to another DOM element
		if (typeof dom == 'string') { this.appendTo(document.querySelector(dom)); }
		else if (dom != null) dom.append(this.dom);
		return this;
	}

	prependTo(dom) {
		// Prepend DOM elemen to another DOM element
		if (typeof dom == 'string') { this.prependTo(document.querySelector(dom)); }
		else if (dom != null) dom.prepend(this.dom);
		return this;
	}

	clear() {
		// Clear dom children
		while (this.dom.children.length) {
			this.dom.removeChild(this.dom.lastChild);
		}
	}

	attr() {
		// Get or set attribute by name (argument[0]) if value (argument[1]) exists
		if (arguments[1] == null) return this.dom[arguments[0]];
		else if (typeof arguments[1] == 'object') { // Apply multiple attributes
			for (const [key, val] of Object.entries(arguments[1])) {
				this.attr(key, val);
			}
		}
		else this.dom.setAttribute(arguments[0], arguments[1]);
		return this;
	}

	addClass(name) {
		this.dom.classList.add(name);
		return this;
	}

	removeClass(name) {
		this.dom.classList.remove(name);
		return this;
	}

	css() {
		if (arguments[1] == null) {
			// Set multiple styles from object
			if (typeof arguments[0] == 'object') {
				for (const [key, val] of Object.entries(arguments[0])) {
					this.dom.style[key] = val;
				}
			}
			else return getComputedStyle(this.dom)[arguments[0]]; // Return existing style
		}
		else { // Set Non-object styling to value
			this.dom.style[arguments[0]] = arguments[1];
		}
		return this;
	}

	html(html) {
		this.dom.innerHTML = html;
		return this;
	}

	text(text) {
		this.dom.textContent = text;
		return this;
	}

	generateUUID() {
		var lut = []; // Look up table
		for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }

		// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
		var d0 = Math.random() * 0xffffffff|0;
		var d1 = Math.random() * 0xffffffff|0;
		var d2 = Math.random() * 0xffffffff|0;
		var d3 = Math.random() * 0xffffffff|0;
		var uuid = lut[d0&0xff] + lut[d0>>8&0xff] + lut[d0>>16&0xff] + lut[d0>>24&0xff] + '-' + lut[d1&0xff] + lut[d1>>8&0xff] + '-' + lut[d1>>16&0x0f|0x40] + lut[d1>>24&0xff] + '-' + lut[d2&0x3f|0x80] + lut[d2>>8&0xff] + '-' + lut[d2>>16&0xff] + lut[d2>>24&0xff] +  lut[d3&0xff] + lut[d3>>8&0xff] + lut[d3>>16&0xff] + lut[d3>>24&0xff]
	
		// .toLowerCase() here flattens concatenated strings to save heap memory space.
		return uuid.toLowerCase();
	}

	createElement(name = 'div') {
		return document.createElement(name);

		// TODO: Conditionally create elements with unique behaviors
	}
}

export { UI }