import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';

class Background extends Mesh {
	constructor() {
		super();
		this.name = 'Background';
		this.radius = 1;
		this.geometry = new SphereGeometry(this.radius, 16, 16);
		this.geometry.computeBoundingBox();
		this.material = new ShaderMaterial({
			uniforms: {
				top: {  value: new Color("#0094ff") },
				bottom: { value: new Color("#ffffff") },
				min: { value: this.geometry.boundingBox.min },
				max: { value: this.geometry.boundingBox.max },
				scale: { value: 0.125 }
			},
			vertexShader: `
				uniform vec3 min;
				uniform vec3 max;
				varying vec2 vUv;
				void main() {
					vUv.y = (position.y - min.y) / (max.y - min.y);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 bottom;
				uniform vec3 top;
				uniform float scale;
				varying vec2 vUv;
				void main() {
					gl_FragColor = vec4(mix(bottom, top, smoothstep(0.5 - (scale / 2.0), 0.5 + (scale / 2.0), vUv.y)), 1.0);
				}
			`,
			side: BackSide
		});
	}

	update(delta, alpha) {
		if (this.target) {
			this.position.copy(this.target.position);
		}
	}

	setTarget(target) {
		this.target = target;
	}
}

export { Background };