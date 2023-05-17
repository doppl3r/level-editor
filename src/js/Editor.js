import { Color, HemisphereLight, PerspectiveCamera, Scene, Vector3 } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Rectangle } from './Rectangle';
import { Selector } from './Selector';
import { UI as $ } from './UI';

class Editor {
	constructor() {
		this.scene = new Scene();
		this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
		this.camera.position.z = 5;
		this.keys = { ShiftLeft: false };
		this.mode = 'object'; // 2 modes: "object" and "edit"
	}

	update(renderDelta, renderAlpha, physicsDelta) {
		//this.scene.getObjectByName('Rectangle').rotation.y += renderDelta * 0.5;
	}

	init(game) {
		this.game = game;

		// Initialize controls
		this.controlsTransform = new TransformControls(this.camera, this.game.renderer.domElement);
		this.controlsTransform.pointer = new Vector3();
		this.setTransformMode('translate');
		this.controlsOrbit = new OrbitControls(this.camera, this.game.renderer.domElement);
		this.controlsOrbit.enableRotate = false;
		this.controlsOrbit.mouseButtons = { LEFT: 2, MIDDLE: 2, RIGHT: 2 };
		this.controlsOrbit.zoomSpeed = 3;

		// Initialize selector
		this.selector = new Selector(this.camera, this.scene, this.game.renderer);
		
		// Modify outline
		this.game.outlinePass.edgeStrength = 3; // Default 3
		this.game.outlinePass.edgeGlow = 0; // Default 0
		this.game.outlinePass.edgeThickness = 0.25; // Default 1
		this.game.outlinePass.visibleEdgeColor = new Color('#E8BE7F');
		this.game.outlinePass.hiddenEdgeColor = new Color('#E8BE7F');
		this.game.outlinePass.selectedObjects = [this.selector.selectedObjects];

		// Add event listeners
		this.addEventListeners();

		// Test Shape logic
		this.test();
	}

	test() {
		// Enable event listener
		this.isActive = true;

		// Add basic environment light
		var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
		hemisphere.position.set(0, 0, 2);
		this.scene.add(hemisphere);

		// Add basic rectangle
		var rectangle = new Rectangle();
		rectangle.setTexture(this.game.assets.textures.cache['grass-fairway']);
		rectangle.position.set(-1, 1.5, -10.5);
		rectangle.rotation.set(0, 0, Math.PI);
		this.scene.add(rectangle);

		var rectangle = new Rectangle();
		rectangle.setTexture(this.game.assets.textures.cache['crate']);
		rectangle.position.set(1, -1, -10);
		this.scene.add(rectangle);

		// Add controls
		this.scene.add(this.controlsTransform);

		// Update Vue SceneList with scene data
		this.updateObjectNames();
		this.updateEditor();
	}

	addEventListeners() {
		var _this = this;
		window.addEventListener('pointerdown', function(e) { _this.handleInput(e); }, false);
		window.addEventListener('pointermove', function(e) { _this.handleInput(e); }, false);
		window.addEventListener('pointerup', function(e) { _this.handleInput(e); }, false);
		window.addEventListener('keydown', function(e) { _this.handleInput(e); }, false);
		window.addEventListener('keyup', function(e) { _this.handleInput(e); }, false);
		window.addEventListener('selectObject', function(e) { _this.selectObjectEvent(e); })
	}

	handleInput(e) {
		// Allow boolean to dictate event context
		if (this.isActive == true) {

			// Check if target equals renderer.domElement
			if (e.target == this.game.renderer.domElement) {
				// Use select box if controls are not visible
				switch(e.type) {
					case 'pointerdown': this.pointerDown(e); break;
					case 'pointermove': this.pointerMove(e); break;
					case 'pointerup': this.pointerUp(e); break;
				}
			}
			else if (e.target.type == undefined) {
				// Only do shortcuts on non-input types
				switch(e.type) {
					case 'keydown': this.keyDown(e); break;
					case 'keyup': this.keyUp(e); break;
				}
			}
		}
	}

	pointerDown(e) {
		// Set pointer intent based on input
		this.setPointerIntent('select', false); // Soft reset intent to default 'select'
		if (this.controlsTransform.dragging == true) { this.setPointerIntent('transform'); }
		else if (e.button == 1 || e.button == 2) this.setPointerIntent('pan_camera');

		// Perform action based on pointer intent
		if (this.pointerIntent == 'select') {
			this.selector.pointerDown(e);
			this.controlsOrbit.panSpeed = 0;
		}
		else if (this.pointerIntent == 'transform') {
			this.controlsTransform.enabled = true;
			this.controlsOrbit.panSpeed = 0;
		}
		else if (this.pointerIntent == 'pan_camera') {
			this.controlsTransform.enabled = false;
			this.controlsOrbit.panSpeed = 1;
		}
	}
	
	pointerMove(e) {
		// Copy coordinates from selector
		this.controlsTransform.pointer.copy(this.selector.getMouse(e));

		// Update selector
		if (this.pointerIntent == 'select') {
			this.selector.pointerMove(e);
		}
		else if (this.pointerIntent == 'transform_hover') {
			// Transform controls
			this.controlsTransform.pointerMove(Object.assign({ button: -1 }, this.controlsTransform.pointer));
		}
	}

	pointerUp(e) {
		// Update selector box and populate collection
		if (this.pointerIntent == 'select') {
			this.selector.pointerUp(e);
			this.selector.select(null, this.keys['ShiftLeft']);

			// Attach transform controls to selected object
			this.attachControls();

			// Update Vue SceneList with scene data
			this.updateEditor();
		}
		else if (this.pointerIntent == 'pan_camera') {
			this.controlsTransform.enabled = true;
			this.resetPointerIntent();
		}
	}

	selectObjectEvent(event) {
		// Get non-proxy object
		var object = this.scene.getObjectByProperty('uuid', event.detail.object.uuid);
		var shiftKey = event.detail.shiftKey;

		// Spoof 'deselect' by defining object with empty uuid
		if (object == undefined) object = { uuid: '' };
		this.selector.select(object, shiftKey);

		// Update Vue SceneList with scene data
		this.updateEditor();
	}

	attachControls() {
		if (this.selector.selectedObjects.children.length > 0) {
			this.controlsTransform.attach(this.selector.selectedObjects);
		}
		else {
			this.controlsTransform.detach();
		}
	}

	setPointerIntent(intent, setOrigin = true) {
		this.pointerIntent = intent;
		this.pointerIntentPrevious = (setOrigin) ? intent : this.pointerIntentPrevious;
	}

	resetPointerIntent() {
		this.pointerIntent = this.pointerIntentPrevious;
	}

	keyDown(e) {
		if (e.repeat) return;
		if (e.code == 'KeyG') this.transformSelected();
		if (e.code == 'KeyR') this.setTransformMode('rotate');
		if (e.code == 'KeyS') this.setTransformMode('scale');
		if (e.code == 'KeyT') this.setTransformMode('translate');
		if (e.code == 'ControlLeft') this.setSnap(1, 15, 1);
		this.keys[e.code] = true;
	}

	keyUp(e) {
		this.keys[e.code] = false;
		if (e.code == 'ControlLeft') this.setSnap(null, null, null);
	}

	setSnap(translate = 1, rotate = 15, scale = 1) {
		this.controlsTransform.setTranslationSnap(translate);
		this.controlsTransform.setRotationSnap(rotate * (Math.PI / 180)); // Convert to radians
		this.controlsTransform.setScaleSnap(scale);
	}

	transformSelected() {
		// Transform pointerDown
		this.setTransformMode('translate');
		this.setPointerIntent('transform_hover');
		this.controlsTransform.axis = 'XY';
		this.controlsTransform.pointerDown(Object.assign({ button: 0 }, this.controlsTransform.pointer));
	}

	setTransformMode(mode = 'translate', dispatchEvent = true) {
		this.controlsTransform.setMode(mode)
		if (mode == 'translate' || mode == 'scale') {
			this.controlsTransform.showX = this.controlsTransform.showY = true;
			this.controlsTransform.showZ = false;
		}
		else if (mode == 'rotate') {
			this.controlsTransform.showX = this.controlsTransform.showY = false;
			this.controlsTransform.showZ = true;
		}

		// Dispatch controls to Vue
		if (dispatchEvent == true) window.dispatchEvent(new CustomEvent('updateControls', { detail: this }));
	}

	updateEditor() {
		// Dispatch editor to Vue
		window.dispatchEvent(new CustomEvent('updateEditor', { detail: this }));
	}

	updateObjectNames() {
		// Ensure unique names for objects by append indexes
		for (var i = 0; i < this.scene.children.length; i++) {
			var object = this.scene.children[i];
			
			// Update object name if missing
			if (object.name == '') object.name = object.constructor.name||'Object';
		}
	}

	getSceneChildren() {
		// Create a shallow list of scene children
		var children = [];
		for (var i = 0; i < this.scene.children.length; i++) {
			var child = this.scene.children[i];
			
			// Ignore selectedObjects
			if (child.name == 'selectedObjects') {
				for (var j = 0; j < child.children.length; j++) {
					var selectedChild = child.children[j];
					children.push(selectedChild);
				}
			}
			else {
				if (child.isSelectable) children.push(child);
			}
		}
		
		// Sort by name and then uuid
		children.sort((a, b)=> {
			if (a.name === b.name){ return a.uuid < b.uuid ? -1 : 1 }
			else { return a.name < b.name ? -1 : 1 }
		});
		return children;
	}
}

export { Editor };