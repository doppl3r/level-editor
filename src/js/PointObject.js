import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Vector3 } from 'three';

class PointObject extends Points {
    constructor() {
        super();

        // Declare geometry and material
        this.name = 'PointObject';
        this.geometry = new BufferGeometry();
        this.material = new PointsMaterial({ size: 12, sizeAttenuation: false });
        this.renderOrder = 999;
        this.onBeforeRender = function(renderer) { renderer.clearDepth(); }

        // Define single point
        this.geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3));
    }
}

export { PointObject };