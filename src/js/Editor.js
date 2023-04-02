import { HemisphereLight, PerspectiveCamera, Raycaster, Scene, Vector2 } from 'three';
import { Rectangle } from './Rectangle';
import { Selector } from './Selector';

class Editor {
    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera.position.z = 6;
        this.raycaster = new Raycaster();
        this.mouse = { down: new Vector2(), move: new Vector2(), up: new Vector2(), isDown: false };
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

        // Initialize selectorHelper
        this.selector = new Selector(this.camera, this.scene, this.app.renderer, 'selectBox');
        
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

    mouseDown(e) {
        // Reset selected items to default emission
        for (var item of this.selector.collection) {
            item.isSelected = false;
        }

        // Update selector start point
        this.selector.mouseDown(e);
    }

    mouseMove(e) {
        this.selector.mouseMove(e);
    }

    mouseUp(e) {
        // Update selector
        this.selector.mouseUp(e);
        var selected = this.selector.select();

        for (var i = 0; i < selected.length; i++) {
            selected[i].isSelected = true;
        }
        console.log(selected);
    }
}

export { Editor };