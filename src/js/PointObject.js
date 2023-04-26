import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from 'three';

class PointObject extends Points {
	constructor() {
		super();

		// Declare geometry and material
		this.name = 'PointObject';
		this.geometry = new BufferGeometry();
		this.material = new PointsMaterial({ color: '#ffffff', size: 0.25, sizeAttenuation: true });
		this.renderOrder = 999;
		this.onBeforeRender = function(renderer) { renderer.clearDepth(); }

		// Define single point
		this.geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3));
	}
}

export { PointObject };