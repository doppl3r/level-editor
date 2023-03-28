import { ExtrudeGeometry, Mesh, MeshPhongMaterial, Object3D, RepeatWrapping, Shape, Vector2 } from 'three';

class Rectangle extends Object3D {
    constructor() {
        super();
        this.name = 'Rectangle';
        this.settings = {
            extrude: {
                bevelEnabled: false,
                depth: 1
            },
            texture: {
                center: new Vector2(0, 0),
                offset: new Vector2(0, 0),
                repeat: new Vector2(1, 1),
                rotation: 0,
                wrapS: RepeatWrapping,
                wrapT: RepeatWrapping
            }
        };
        this.points = [
            new Vector2(0.5, -0.5),
            new Vector2(-0.5, -0.5),
            new Vector2(-0.5, 0.5),
            new Vector2(0.5, 0.5),
            new Vector2(3.0, -0.15),
            new Vector2(3.75, 0.7),
            new Vector2(3.5, 2.7),
            new Vector2(4.5, 3),
            new Vector2(5, -0.2),
            new Vector2(4, -0.8),
            new Vector2(2, -1),
        ];
        this.shape = new Shape(this.points);
        this.geometry = new ExtrudeGeometry(this.shape, this.settings.extrude);
        this.material = new MeshPhongMaterial({ color: '#ff00ff' });
        this.mesh = new Mesh(this.geometry, this.material);
        this.add(this.mesh);
    }

    update() {
        
    }

    updateExtrusion() {
        // Use only for updating BufferedGeometry
    }

    setTexture(texture) {
        Object.assign(texture, this.settings.texture);
        this.material.map = texture;
    }
}

export { Rectangle };