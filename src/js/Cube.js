import { ExtrudeGeometry, Mesh, MeshPhongMaterial, RepeatWrapping, Shape, TextureLoader, Vector2, Vector3 } from 'three';
import { Body } from 'matter-js';
import { PointObject } from './PointObject';

class Cube extends Mesh {
	constructor() {
		super();
		this.name = 'Cube';
		this.settings = {
			extrude: {
				curveSegments: 12, // Default 12
				steps: 1, // (Required) Default 1
				depth: 2, // Default 1
				bevelEnabled: false, // (Required) Default true
				bevelThickness: 0.2, // Default 0.2
				bevelSize: 0.1, // Default 0.1
				bevelOffset: 0, // Default 0.0
				bevelSegments: 3, // Default 3
				
			},
			texture: {
				center: new Vector2(0, 0),
				magFilter: 1003, // 1003 = nearest neighbor, 1006 = Default smoothing
				offset: new Vector2(0, 0),
				repeat: new Vector2(1, 1),
				rotation: 0,
				wrapS: RepeatWrapping,
				wrapT: RepeatWrapping
			}
		};
		this.points = [
			new Vector2(-1, -1),
			new Vector2(-1, 1),
			new Vector2(1, 1),
			new Vector2(1, -1),
		];
		this.shape = new Shape(this.points);
		this.center = new PointObject();
		this.geometry = new ExtrudeGeometry(this.shape, this.settings.extrude);
		this.material = new MeshPhongMaterial({ color: '#ffffff' });
		this.isSelectable = true;
		this.updateCenter();

		// Physics properties
		this.body = Body.create();
		
		// Add center point object to this cube
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

	setTextureSource(src, forceUpdate = false, callback = function(){}) {
		var _this = this;
		// Update material with current settings
		function updateMaterial() {
			// Copy default settings
			Object.assign(_this.material.map, _this.settings.texture);

			// Deep clone material & map
			if (_this.material) {
				_this.material.needsUpdate = true;

				if (_this.material.map) {
					// Update data src value
					_this.material.map.source.data.src = src;
					_this.material.map.source.needsUpdate = true;
					_this.material.map.needsUpdate = true;
				}
			}
			callback(); // Run callback
		}

		// Create a new material asynchronously if it is null
		if (this.material.map == null || forceUpdate == true) {
			this.material.map = new TextureLoader().load(src, updateMaterial);
		}
		else {
			// Replace material immediately
			updateMaterial();
		}
	}

	removeTexture() {
		this.material.map = null;
		this.material.needsUpdate = true;
	}

	resetUVs() {
		var pos = this.geometry.getAttribute('position'), nor = this.geometry.getAttribute('normal'), uvs = this.geometry.getAttribute('uv');

		// Loop through all positions
		for (var i = 0; i < pos.count; i++) {
			var x = 0, y = 0;
			var nx = Math.abs(nor.getX(i)), ny = Math.abs(nor.getY(i)), nz = Math.abs(nor.getZ(i));

			// if facing X, Y or Z
			if (nx >= ny && nx >= nz) { x = pos.getZ(i); y = pos.getY(i); }
			if (ny >= nx && ny >= nz) { x = pos.getX(i); y = pos.getZ(i); }
			if (nz >= nx && nz >= ny) { x = pos.getX(i); y = pos.getY(i); }
			uvs.setXY(i, x, y);
		}
	}
}

export { Cube };