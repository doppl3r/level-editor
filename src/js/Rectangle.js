import { ExtrudeGeometry, Mesh, MeshPhongMaterial, RepeatWrapping, Shape, Vector2, Vector3 } from 'three';
import { PointObject } from './PointObject';

class Rectangle extends Mesh {
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
                offset: new Vector2(0.5, 0.5),
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
        this.center = new PointObject();
        this.geometry = new ExtrudeGeometry(this.shape, this.settings.extrude);
        this.material = new MeshPhongMaterial({ color: '#ffffff' });
        this.updateCenter();
        
        // Add center point object to this rectangle
        this.add(this.center);
    }

    update() {
        
    }

    updateCenter() {
        // Recalculate center from geometry
        this.geometry.computeBoundingSphere();

        // Update geometry position
        var position = this.geometry.boundingSphere.center.clone();
        this.geometry.translate(-position.x, -position.y, -position.z);
        this.position.copy(position);

        // Update center PointObject position
        this.center.position.copy(this.geometry.boundingSphere.center);
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