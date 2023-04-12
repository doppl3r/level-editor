import { HemisphereLight, PerspectiveCamera, Scene, Vector2 } from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Rectangle } from './Rectangle';
import { Selector } from './Selector';

class Editor {
    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 6;
        this.mouse = { down: new Vector2(), move: new Vector2(), up: new Vector2(), isDown: false };
        this.keys = {};
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
        this.controlsOrbit.enabled = false; // Disabled by default
        this.controlsOrbit.enableRotate = false;
        this.controlsOrbit.mouseButtons = { LEFT: 2, MIDDLE: 1, RIGHT: 2 };
        this.controlsOrbit.zoomSpeed = 3;

        // Initialize selector
        this.selector = new Selector(this.camera, this.scene, this.app.renderer, 'selectBox');
        this.selector.setPropertyFilter('name', 'Rectangle');
        
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
        rectangle.setTexture(this.app.assets.textures.cache['crate']);
        rectangle.position.set(1, 2, 0);
        this.scene.add(rectangle);

        var rectangle = new Rectangle();
        rectangle.setTexture(this.app.assets.textures.cache['bricks']);
        rectangle.position.set(-1, -2, 0);
        rectangle.rotation.set(0, 0, Math.PI);
        this.scene.add(rectangle);

        // Add controls
        this.scene.add(this.controlsTransform);
    }

    addEventListeners() {
        var _this = this;
        window.addEventListener('mousedown', function(e) { _this.handleInput(e); } , false);
        window.addEventListener('mousemove', function(e) { _this.handleInput(e); } , false);
        window.addEventListener('mouseup', function(e) { _this.handleInput(e); } , false);
        window.addEventListener('keydown', function(e) { _this.handleInput(e); } , false);
        window.addEventListener('keyup', function(e) { _this.handleInput(e); } , false);

        // Add controls listeners
        this.controlsTransform.addEventListener('mouseDown', function(e) { _this.controlsTransform.isActive = true; });
        this.controlsTransform.addEventListener('mouseUp', function(e) { _this.controlsTransform.isActive = false; });
        this.controlsOrbit.addEventListener('start', function(e) { _this.controlsOrbit.isActive = true; });
        this.controlsOrbit.addEventListener('end', function(e) { _this.controlsOrbit.isActive = false; });
    }

    handleInput(e) {
        // Allow boolean to dictate event context
        if (this.isActive == true) {
            // Use select box if controls are not visible
            switch(e.type) {
                case 'mousedown': this.mouseDown(e); break;
                case 'mousemove': this.mouseMove(e); break;
                case 'mouseup': this.mouseUp(e); break;
                case 'keydown': this.keyDown(e); break;
                case 'keyup': this.keyUp(e); break;
            }
        }
    }

    mouseDown(e) {
        // Update selector start point
        this.selector.mouseDown(e);
    }

    mouseMove(e) {
        this.selector.mouseMove(e);
    }

    mouseUp(e) {
        // Update selector box and populate collection
        this.selector.mouseUp(e);
        this.selector.select(this.keys['ShiftLeft'] != true);

        // Attach transform controls to selected object
        if (this.selector.group.children.length > 0) {
            this.controlsTransform.attach(this.selector.group);
        }
        else {
            this.controlsTransform.detach();
        }
    }

    keyDown(e) {
        this.keys[e.code] = true;
    }

    keyUp(e) {
        this.keys[e.code] = false;
    }
}

export { Editor };