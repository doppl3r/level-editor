import { HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, ShapeGeometry, Vector2 } from 'three';
import { Rectangle } from './rectangle';

class Editor {
    constructor() {
        this.sceneDefault = new Scene();
        this.scene = this.sceneDefault;
        this.cameraDefault = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
        this.camera = this.cameraDefault;
        this.camera.position.z = 4;

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
        rectangle.position.set(-2, -1, 0);
        this.scene.add(rectangle);
    }
}

export { Editor };