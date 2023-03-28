import { HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, ShapeGeometry, Vector2 } from 'three';
import { Rectangle } from './rectangle';

class Editor {
    constructor() {
        this.sceneDefault = new Scene();
        this.scene = this.sceneDefault;
        this.cameraDefault = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera = this.cameraDefault;
        this.camera.position.z = 4;
    }

    update(renderDelta, renderAlpha, physicsDelta) {
        this.scene.getObjectByName('Rectangle').rotation.y += renderDelta * 0.5;
    }

    init(app) {
        this.app = app;
        
        // Test Shape logic
        this.test();
    }

    test() {
        // Add basic environment light
        var hemisphere = new HemisphereLight('#ffffff', '#000000', 1);
        hemisphere.position.set(0, -1, 2);
        this.scene.add(hemisphere);

        // Add basic rectangle
        var rectangle = new Rectangle();
        rectangle.setTexture(this.app.assets.textures.cache['bricks']);
        rectangle.position.set(0, -1, 1);
        this.scene.add(rectangle);
    }
}

export { Editor };