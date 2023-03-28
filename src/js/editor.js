import { HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Raycaster, Scene, ShapeGeometry, Vector2 } from 'three';
import { Rectangle } from './rectangle';

class Editor {
    constructor() {
        this.sceneDefault = new Scene();
        this.scene = this.sceneDefault;
        this.cameraDefault = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera = this.cameraDefault;
        this.camera.position.z = 4;
        this.raycaster = new Raycaster();
        this.mouse = { down: new Vector2(), move: new Vector2(), up: new Vector2(), drag: false };
    }

    update(renderDelta, renderAlpha, physicsDelta) {
        this.scene.getObjectByName('Rectangle').rotation.y += renderDelta * 0.5;
    }

    init(app) {
        this.app = app;

        // Add event listeners
        this.addEventListeners();

        // Update raycaster parameters
        this.raycaster.params.Points.threshold = 0.25;
        
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
        rectangle.setTexture(this.app.assets.textures.cache['bricks']);
        rectangle.position.y = -1;
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
        return { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
    }

    mouseDown(e) {
        this.mouse.drag = true;
        this.mouse.down.copy(this.getMouse(e));
        this.raycaster.setFromCamera(this.mouse.down, this.camera);
    }

    mouseMove(e) {
        this.mouse.move.copy(this.getMouse(e));
        this.raycaster.setFromCamera(this.mouse.move, this.camera);
    }

    mouseUp(e) {
        this.mouse.drag = false;
        this.mouse.up.copy(this.getMouse(e));
    }
}

export { Editor };