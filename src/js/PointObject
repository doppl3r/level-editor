import { BufferGeometry, Float32BufferAttribute, Object3D, Points, PointsMaterial } from 'three';

class PointObject extends Object3D {
    constructor() {
        super();

        // Declare geometry and material
        var geometry = new BufferGeometry();
        var material = new PointsMaterial({ size: 0.25 });
        var point = new Points(geometry, material);
        point.renderOrder = 999;
        point.onBeforeRender = function(renderer) { renderer.clearDepth(); }

        // Define single point
        geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3));
        
        // Add point to object
        this.add(point);
    }
}

export { PointObject };