import { Color, HemisphereLight, PerspectiveCamera, Scene, Vector2 } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Rectangle } from './Rectangle';
import { Selector } from './Selector';

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

    init(app) {
        this.app = app;

        // Initialize controls
        this.controlsTransform = new TransformControls(this.camera, this.app.renderer.domElement);
        this.controlsTransform.showZ = false;
        this.controlsTransform.mode = 'translate'; // Options: translate, rotate, scale
        this.controlsOrbit = new OrbitControls(this.camera, this.app.renderer.domElement);
        this.controlsOrbit.enableRotate = false;
        this.controlsOrbit.mouseButtons = { LEFT: 2, MIDDLE: 2, RIGHT: 2 };
        this.controlsOrbit.zoomSpeed = 3;

        // Initialize selector
        this.selector = new Selector(this.camera, this.scene, this.app.renderer);
        
        // Modify outline
        this.app.outlinePass.edgeStrength = 3; // Default 3
        this.app.outlinePass.edgeGlow = 0; // Default 0
        this.app.outlinePass.edgeThickness = 1; // Default 1
        this.app.outlinePass.visibleEdgeColor = new Color('#F59B3C');
        this.app.outlinePass.hiddenEdgeColor = new Color('#F59B3C');
        this.app.outlinePass.selectedObjects = [this.selector.selectedObjects];

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
        hemisphere.position.set(0, 1, 2);
        this.scene.add(hemisphere);

        // Add basic rectangle
        var rectangle = new Rectangle();
        rectangle.setTexture(this.app.assets.textures.cache['grass-fairway']);
        rectangle.position.set(-1, 1, -0.5);
        rectangle.rotation.set(0, 0, Math.PI);
        this.scene.add(rectangle);

        var rectangle = new Rectangle();
        rectangle.setTexture(this.app.assets.textures.cache['crate']);
        rectangle.position.set(1, -1, 0);
        this.scene.add(rectangle);

        // Add controls
        this.scene.add(this.controlsTransform);
    }

    addEventListeners() {
        var _this = this;
        window.addEventListener('pointerdown', function(e) { _this.handleInput(e); }, false);
        window.addEventListener('pointermove', function(e) { _this.handleInput(e); }, false);
        window.addEventListener('pointerup', function(e) { _this.handleInput(e); }, false);
        window.addEventListener('keydown', function(e) { _this.handleInput(e); }, false);
        window.addEventListener('keyup', function(e) { _this.handleInput(e); }, false);
    }

    handleInput(e) {
        // Allow boolean to dictate event context
        if (this.isActive == true) {
            // Use select box if controls are not visible
            switch(e.type) {
                case 'pointerdown': this.pointerDown(e); break;
                case 'pointermove': this.pointerMove(e); break;
                case 'pointerup': this.pointerUp(e); break;
                case 'keydown': this.keyDown(e); break;
                case 'keyup': this.keyUp(e); break;
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
        if (this.pointerIntent == 'select') {
            this.selector.pointerMove(e);
        }
    }

    pointerUp(e) {
        // Update selector box and populate collection
        if (this.pointerIntent == 'select') {
            this.selector.pointerUp(e);
            this.selector.select(this.keys['ShiftLeft']);

            // Attach transform controls to selected object
            if (this.selector.selectedObjects.children.length > 0) {
                this.controlsTransform.attach(this.selector.selectedObjects);
            }
            else {
                this.controlsTransform.detach();
            }
        }
        else if (this.pointerIntent == 'pan_camera') {
            this.controlsTransform.enabled = true;
            this.resetPointerIntent();
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
        if (e.code == 'Tab') e.preventDefault();
        this.keys[e.code] = true;
    }

    keyUp(e) {
        this.keys[e.code] = false;
    }
}

export { Editor };