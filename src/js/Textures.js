import { TextureLoader } from 'three';
import json from '../json/textures.json';

class Textures {
	constructor(manager) {
		this.cache = {};
		this.loader = new TextureLoader(manager);
	}

	load() {
		var _this = this;
		for (const [key, value] of Object.entries(json)) {
			this.loader.load(value.url, function(texture) {
				// Load model from gltf.scene Object3D (includes SkinnedMesh)
				_this.cache[key] = texture;
				_this.cache[key]['name'] = key;
				_this.cache[key].magFilter = value.magFilter || 1006; // LinearFilter (default) = 1006, NearestFilter = 1003
			});
		}
	}
}

export { Textures };