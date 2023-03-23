import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

class HTMLRenderer extends CSS2DRenderer {
    constructor() {
        super();

        // Update DOM elements
        Object.assign(this.domElement.style, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' });
        this.setSize(window.innerWidth, window.innerHeight); // Default fullscreen
    }
}

class HTMLObject extends CSS2DObject {
    constructor(element) {
        // Create element from string value
        if (typeof element !== 'object') {
            var html = ((/<\/?[a-z][\s\S]*>/i.test(element)) ? element : '<div>' + element + '</div>').trim();
            element = document.createElement('template');
            element.innerHTML = html;
            element = element.content.firstChild;
        }

        // Inherit CSS2DObject constructor with a new element
        super(element);
        
        // Allow HTML to be removed when the parent is removed
        var _this = this;
        this.addEventListener('added', function() {
            _this.parent.addEventListener('removed', function() {
                _this.removeFromParent();
            });
        });
    }
}

export { HTMLRenderer, HTMLObject };