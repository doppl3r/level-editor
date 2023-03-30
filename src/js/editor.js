import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper.js';
import { HemisphereLight, PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';
import { Rectangle } from './rectangle';

class Editor {
    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 6;
        this.raycaster = new Raycaster();
        this.mouse = { down: new Vector2(), move: new Vector2(), up: new Vector2(), isDown: false };
        this.selectionBox = new SelectionBox(this.camera, this.scene);
    }

    update(renderDelta, renderAlpha, physicsDelta) {
        //this.scene.getObjectByName('Rectangle').rotation.y += renderDelta * 0.5;
    }

    init(app) {
        this.app = app;

        // Add event listeners
        this.addEventListeners();

        // Update raycaster parameters
        this.raycaster.params.Points.threshold = 0.25;

        // Initialize selectionBoxHelper
        this.selectionBoxHelper = new SelectionHelper(this.app.renderer, 'selectBox');
        
        // Test Shape logic
        this.test();
    }

    test() {
        // Enable event listener
        this.isActive = true;

        // Add basic environment light
        var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
        //hemisphere.position.set(0, -1, 2);
        hemisphere.position.set(0, 1, 2);
        this.scene.add(hemisphere);

        // Add basic rectangle
        var rectangle = new Rectangle();
        rectangle.setTexture(this.app.assets.textures.cache['crate']);
        this.scene.add(rectangle);

        var rectangle = new Rectangle();
        rectangle.setTexture(this.app.assets.textures.cache['bricks']);
        rectangle.position.set(-2, -2, 0);
        rectangle.rotation.set(0, Math.PI, 0);
        this.scene.add(rectangle);
    }

    addEventListeners() {
        var _this = this;
        window.addEventListener('mousedown', function(e) { _this.handleInput(e); } , false);
        window.addEventListener('mousemove', function(e) { _this.handleInput(e); } , false);
        window.addEventListener('mouseup', function(e) { _this.handleInput(e); } , false);
    }

    handleInput(e) {
        // Allow boolean to dictate event context
        if (this.isActive == true) {
            switch(e.type) {
                case 'mousedown': this.mouseDown(e); break;
                case 'mousemove': this.mouseMove(e); break;
                case 'mouseup': this.mouseUp(e); break;
            }
        }
    }

    setRaycaster(e) {

    }

    getIndex() {
        //var intersects = this.raycaster.intersectObject()
    }

    getMouse(e) {
        return { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1, z: 0.5 };
    }

    mouseDown(e) {
        this.mouse.isDown = true;
        this.mouse.down.copy(this.getMouse(e));
        this.raycaster.setFromCamera(this.mouse.down, this.camera);

        // Revert selected items to default emission
        for (var item of this.selectionBox.collection) {
            item.material.emissive.set('#000000');
        }

        // Update selectionBox start point
        this.selectionBox.startPoint.copy(this.getMouse(e));
    }

    mouseMove(e) {
        this.mouse.move.copy(this.getMouse(e));
        this.raycaster.setFromCamera(this.mouse.move, this.camera);
    }

    mouseUp(e) {
        this.mouse.isDown = false;
        this.mouse.up.copy(this.getMouse(e));

        // Update selectionBox
        this.selectionBox.endPoint.copy(this.getMouse(e));
        var allSelected = this.selectionBox.select();

        for (var i = 0; i < allSelected.length; i++) {
            allSelected[i].material.emissive.set('#ffffff');
        }
    }
}

export { Editor };