import { ExtrudeGeometry, Mesh, MeshPhongMaterial, Object3D, Points, PointsMaterial, RepeatWrapping, Shape, ShapeGeometry, Vector2 } from 'three';

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
        this.geometryPoints = new ShapeGeometry(this.shape);
        this.material = new MeshPhongMaterial({ color: '#ff00ff' });
        this.materialPoints = new PointsMaterial({ size: 0.25, color: '#ffffff' });
        this.mesh = new Mesh(this.geometry, this.material);
        this.meshPoints = new Points(this.geometryPoints, this.materialPoints);
        this.meshPoints.renderOrder = 999;
        this.meshPoints.onBeforeRender = function(renderer) { renderer.clearDepth(); }
        this.add(this.mesh, this.meshPoints);
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