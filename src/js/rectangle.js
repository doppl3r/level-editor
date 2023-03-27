import { Mesh, MeshPhongMaterial, Object3D, Shape, ExtrudeGeometry, Vector2 } from 'three';

class Rectangle extends Object3D {
    constructor() {
        super();
        this.name = 'Rectangle';
        this.points = [
            new Vector2(0.5, 0.5),
            new Vector2(-0.5, 0.5),
            new Vector2(-0.5, -0.5),
            new Vector2(0.5, -0.5),
        ];
        this.shape = new Shape(this.points);
        this.settings = { depth: 1, bevelEnabled: false };
        this.geometry = new ExtrudeGeometry(this.shape, this.settings);
        this.material = new MeshPhongMaterial({ color: '#ff00ff' });
        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }

    update() {
        // Use only for updating BufferedGeometry
        
    }
}

export { Rectangle };